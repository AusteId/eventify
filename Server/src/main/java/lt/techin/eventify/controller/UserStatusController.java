package lt.techin.eventify.controller;

import lt.techin.eventify.dto.userStatus.TypingStatusRequest;
import lt.techin.eventify.dto.userStatus.UserStatusDTO;
import lt.techin.eventify.exception.NotFoundException;
import lt.techin.eventify.model.OnlineStatus;
import lt.techin.eventify.model.User;
import lt.techin.eventify.model.UserStatus;
import lt.techin.eventify.repository.mysql.UserRepository;
import lt.techin.eventify.service.UserStatusService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class UserStatusController {
    private static final Logger logger = LoggerFactory.getLogger(UserStatusController.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final UserStatusService userStatusService;
    private final UserRepository userRepository;

    public UserStatusController(SimpMessagingTemplate messagingTemplate, UserStatusService userStatusService, UserRepository userRepository) {
        this.messagingTemplate = messagingTemplate;
        this.userStatusService = userStatusService;
        this.userRepository = userRepository;
    }

    @MessageMapping("/status/typing")
    public void updateTypingStatus(@Payload TypingStatusRequest request, Authentication authentication) {
        if (authentication == null) {
            logger.error("Authentication is null in updateTypingStatus");
            return;
        }

        String username = authentication.getName();
        logger.debug("Received typing status update from user: {}, conversationId: {}, isTyping: {}",
                username, request.getConversationId(), request.isTyping());

        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new NotFoundException("User not found: " + username));

            UserStatus previousStatus = userStatusService.getUserStatus(user.getId());
            logger.debug("Previous status for user {}: isTyping={}, conversation={}, lastSeen={}",
                    user.getId(), previousStatus.isTyping(), previousStatus.getTypingInConversation(),
                    previousStatus.getLastSeen());


            UserStatus updatedStatus = userStatusService.setTyping(
                    user.getId(), request.getConversationId(), request.isTyping());


            Map<String, Object> simpleStatus = Map.of(
                    "userId", user.getId(),
                    "typing", request.isTyping(),
                    "typingInConversation", request.getConversationId()
            );

            logger.debug("Broadcasting simple typing status: {}", simpleStatus);
            messagingTemplate.convertAndSend("/topic/typing/" + request.getConversationId(), simpleStatus);

            logger.debug("Successfully sent typing status updates for user: {}", user.getId());
        } catch (Exception e) {
            logger.error("Error updating typing status: ", e);
        }
    }

    @MessageMapping("/status/get-all")
    public void getAllUserStatuses(Authentication authentication) {
        if (authentication == null) {
            logger.error("Authentication is null in getAllUserStatuses");
            return;
        }

        logger.debug("Request for all user statuses from: {}", authentication.getName());

        List<UserStatusDTO> allStatuses = userStatusService.getAllOnlineUsers().stream()
                .map(status -> userStatusService.getUserStatusWithDetails(status.getUserId()))
                .toList();

        messagingTemplate.convertAndSend("/topic/status/all", allStatuses);
    }



    @MessageMapping("/status/update")
    public void updateUserStatus(@Payload Object statusObj, Authentication authentication) {
        if (authentication == null) {
            logger.error("Authentication is null in updateUserStatus");
            return;
        }

        try {
            String statusStr;
            if (statusObj instanceof byte[]) {
                statusStr = new String((byte[]) statusObj, StandardCharsets.UTF_8);
                logger.debug("Received binary status data, converted to: '{}'", statusStr);
            } else if (statusObj instanceof String) {
                statusStr = (String) statusObj;
            } else {
                statusStr = String.valueOf(statusObj);
                logger.debug("Received status of type: {}, value: '{}'",
                        statusObj.getClass().getName(), statusStr);
            }

            statusStr = statusStr.replace("\"", "").trim();

            logger.debug("Processing status update: '{}' from user: {}", statusStr, authentication.getName());

            OnlineStatus status;
            try {
                status = OnlineStatus.valueOf(statusStr);
            } catch (IllegalArgumentException e) {
                logger.error("Invalid status value: '{}'. Valid values are: {}",
                        statusStr, java.util.Arrays.toString(OnlineStatus.values()), e);
                return;
            }

            String username = authentication.getName();
            logger.debug("Updating status for user: {} to: {}", username, status);

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new NotFoundException("User not found: " + username));

            userStatusService.updateStatus(user.getId(), status);
            UserStatusDTO statusDTO = userStatusService.getUserStatusWithDetails(user.getId());

            logger.debug("Broadcasting status update to /topic/status");
            messagingTemplate.convertAndSend("/topic/status", statusDTO);
        } catch (Exception e) {
            logger.error("Error updating user status: ", e);
        }
    }
}