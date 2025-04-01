package lt.techin.eventify.service;

import lt.techin.eventify.dto.userStatus.UserStatusDTO;
import lt.techin.eventify.exception.NotFoundException;
import lt.techin.eventify.model.OnlineStatus;
import lt.techin.eventify.model.User;
import lt.techin.eventify.model.UserStatus;
import lt.techin.eventify.repository.mongodb.UserStatusRepository;
import lt.techin.eventify.repository.mysql.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserStatusService {
    private static final Logger logger = LoggerFactory.getLogger(UserStatusService.class);

    private final UserStatusRepository userStatusRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    private static final int TYPING_TIMEOUT_SECONDS = 5;
    private static final int AWAY_TIMEOUT_MINUTES = 5;

    private final Map<Long, LocalDateTime> lastStatusUpdate = new ConcurrentHashMap<>();
    private static final int MIN_STATUS_UPDATE_INTERVAL_SECONDS = 5;

    public UserStatusService(UserStatusRepository userStatusRepository, UserRepository userRepository, SimpMessagingTemplate messagingTemplate) {
        this.userStatusRepository = userStatusRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public UserStatusDTO getUserStatusWithDetails(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found: " + userId));
        UserStatus userStatus = userStatusRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultStatus(userId));

        return new UserStatusDTO(
                user.getId(),
                user.getUsername(),
                userStatus.getStatus(),
                userStatus.isTyping(),
                userStatus.getTypingInConversation(),
                userStatus.getLastSeen()
        );
    }

    public UserStatus getUserStatus(Long userId) {
        return userStatusRepository.findByUserId(userId)
                .orElseGet(() -> {
                    logger.debug("Creating new status for user: {}", userId);
                    UserStatus newStatus = new UserStatus();
                    newStatus.setUserId(userId);
                    newStatus.setStatus(OnlineStatus.OFFLINE);
                    newStatus.setTyping(false);
                    newStatus.setLastSeen(LocalDateTime.now());
                    return userStatusRepository.save(newStatus);
                });
    }

    public UserStatus createDefaultStatus(Long userId) {
        logger.debug("Creating default status for user: {}", userId);
        UserStatus newStatus = new UserStatus();
        newStatus.setUserId(userId);
        newStatus.setStatus(OnlineStatus.OFFLINE);
        newStatus.setTyping(false);
        newStatus.setLastSeen(LocalDateTime.now());
        return userStatusRepository.save(newStatus);
    }

    public UserStatus updateStatus(Long userId, OnlineStatus status) {
        logger.debug("Updating status for user: {} to: {}", userId, status);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastUpdate = lastStatusUpdate.getOrDefault(userId, LocalDateTime.MIN);

        UserStatus userStatus = getUserStatus(userId);

        if (userStatus.getStatus() == status &&
                ChronoUnit.SECONDS.between(lastUpdate, now) < MIN_STATUS_UPDATE_INTERVAL_SECONDS) {
            logger.debug("Skipping status update for user: {} (throttled)", userId);
            return userStatus;
        }

        userStatus.setStatus(status);
        userStatus.setLastSeen(now);

        UserStatus savedStatus = userStatusRepository.save(userStatus);
        logger.debug("Status updated successfully for user: {}", userId);

        lastStatusUpdate.put(userId, now);

        broadcastStatusUpdate(userId);

        return savedStatus;
    }

    public synchronized UserStatus setTyping(Long userId, String conversationId, boolean isTyping) {
        logger.debug("Setting typing status for user: {} in conversation: {} to: {}",
                userId, conversationId, isTyping);

        UserStatus userStatus = getUserStatus(userId);

        logger.debug("Previous typing state: isTyping={}, conversation={}",
                userStatus.isTyping(), userStatus.getTypingInConversation());

        LocalDateTime now = LocalDateTime.now();
        userStatus.setLastSeen(now);

        userStatus.setTyping(isTyping);
        userStatus.setTypingInConversation(isTyping ? conversationId : null);

        UserStatus savedStatus = userStatusRepository.save(userStatus);

        logger.debug("Updated typing state: isTyping={}, conversation={}, lastSeen={}",
                savedStatus.isTyping(), savedStatus.getTypingInConversation(), savedStatus.getLastSeen());

        return savedStatus;
    }

    public void broadcastStatusUpdate(Long userId) {
        try {
            UserStatusDTO statusDTO = getUserStatusWithDetails(userId);
            logger.debug("Broadcasting status update for user: {}", userId);
            messagingTemplate.convertAndSend("/topic/status", statusDTO);
        } catch (Exception e) {
            logger.error("Error broadcasting status update: ", e);
        }
    }

    @Scheduled(fixedRate = 2000)
    public void checkTypingTimeouts() {
        LocalDateTime now = LocalDateTime.now();

        List<UserStatus> typingUsers = userStatusRepository.findByIsTypingTrue();

        if (!typingUsers.isEmpty()) {
            logger.debug("Checking typing timeouts for {} users", typingUsers.size());
        }

        for (UserStatus status : typingUsers) {

            long secondsSinceLastSeen = 0;
            if (status.getLastSeen() != null) {
                secondsSinceLastSeen = ChronoUnit.SECONDS.between(status.getLastSeen(), now);
            }

            if (secondsSinceLastSeen > TYPING_TIMEOUT_SECONDS) {
                logger.debug("Typing timeout for user: {} (last seen: {} - {} seconds ago)",
                        status.getUserId(), status.getLastSeen(), secondsSinceLastSeen);

                String conversationId = status.getTypingInConversation();

                status.setTyping(false);
                status.setTypingInConversation(null);
                UserStatus savedStatus = userStatusRepository.save(status);

                logger.debug("Reset typing status for user {}: isTyping={}",
                        status.getUserId(), savedStatus.isTyping());

                if (conversationId != null) {
                    try {
                        User user = userRepository.findById(status.getUserId())
                                .orElse(null);

                        if (user != null) {
                            UserStatusDTO statusDTO = getUserStatusWithDetails(user.getId());
                            logger.debug("Broadcasting typing timeout for user: {} in conversation: {}",
                                    user.getId(), conversationId);
                            messagingTemplate.convertAndSend("/topic/typing/" + conversationId, statusDTO);

                            Map<String, Object> simpleStatus = Map.of(
                                    "userId", user.getId(),
                                    "typing", false,
                                    "typingInConversation", conversationId
                            );
                            messagingTemplate.convertAndSend("/topic/typing/" + conversationId, simpleStatus);
                        }
                    } catch (Exception e) {
                        logger.error("Error broadcasting typing timeout", e);
                    }
                }
            } else {
                logger.debug("User {} still typing (last seen: {} - {} seconds ago)",
                        status.getUserId(), status.getLastSeen(), secondsSinceLastSeen);
            }
        }
    }

    @Scheduled(fixedRate = 60000)
    public void checkInactiveUsers() {
        LocalDateTime now = LocalDateTime.now();

        List<UserStatus> onlineUsers = userStatusRepository.findByStatus(OnlineStatus.ONLINE);

        if (!onlineUsers.isEmpty()) {
            logger.debug("Checking for inactive users among {} online users", onlineUsers.size());
        }

        for (UserStatus status : onlineUsers) {
            if (status.getLastSeen().until(now, ChronoUnit.MINUTES) > AWAY_TIMEOUT_MINUTES) {
                logger.debug("User {} inactive for more than {} minutes, setting to AWAY",
                        status.getUserId(), AWAY_TIMEOUT_MINUTES);

                status.setStatus(OnlineStatus.AWAY);
                userStatusRepository.save(status);

                broadcastStatusUpdate(status.getUserId());
            }
        }
    }

    public void updateLastSeen(Long userId) {
        UserStatus userStatus = getUserStatus(userId);
        userStatus.setLastSeen(LocalDateTime.now());
        userStatusRepository.save(userStatus);
        logger.debug("Updated lastSeen for user: {}", userId);
    }

    @Scheduled(fixedRate = 3600000)
    public void cleanupStatusUpdateMap() {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);

        Map<Long, LocalDateTime> toRemove = new HashMap<>();

        lastStatusUpdate.forEach((userId, timestamp) -> {
            if (timestamp.isBefore(oneHourAgo)) {
                toRemove.put(userId, timestamp);
            }
        });

        toRemove.keySet().forEach(lastStatusUpdate::remove);

        if (!toRemove.isEmpty()) {
            logger.debug("Cleaned up {} old entries from status update tracking", toRemove.size());
        }
    }
}