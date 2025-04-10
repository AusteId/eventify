package lt.techin.eventify.config;

import lt.techin.eventify.dto.userStatus.UserStatusDTO;
import lt.techin.eventify.model.OnlineStatus;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.mysql.UserRepository;
import lt.techin.eventify.service.UserStatusService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.AbstractSubProtocolEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;


import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Component
public class WebSocketEventListener {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    private final UserStatusService userStatusService;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketEventListener(UserStatusService userStatusService,
                                  UserRepository userRepository,
                                  SimpMessagingTemplate messagingTemplate) {
        this.userStatusService = userStatusService;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    private String getSessionId(AbstractSubProtocolEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        return accessor.getSessionId();
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        Principal user = event.getUser();
        if (user == null) return;

        String username = user.getName();
        String sessionId = getSessionId(event);
        logger.info("User connected: {} (session: {})", username, sessionId);

        Optional<User> userOptional = userRepository.findByUsername(username);

        userOptional.ifPresent(u -> {
            userStatusService.updateStatus(u.getId(), OnlineStatus.ONLINE);

            List<UserStatusDTO> onlineStatuses = userStatusService.getAllOnlineUsers().stream()
                    .map(status -> userStatusService.getUserStatusWithDetails(status.getUserId()))
                    .toList();

            messagingTemplate.convertAndSend("/topic/status/all", onlineStatuses);
        });
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        Principal user = event.getUser();
        if (user == null) return;

        String username = user.getName();
        logger.info("User disconnected: {}", username);

        Optional<User> userOptional = userRepository.findByUsername(username);

        userOptional.ifPresent(u -> {
            userStatusService.updateStatus(u.getId(), OnlineStatus.OFFLINE);
        });
    }
}
