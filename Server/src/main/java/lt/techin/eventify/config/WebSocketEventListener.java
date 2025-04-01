package lt.techin.eventify.config;

import lt.techin.eventify.model.OnlineStatus;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.mysql.UserRepository;
import lt.techin.eventify.service.UserStatusService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.Optional;

@Component
public class WebSocketEventListener {
    private final UserStatusService userStatusService;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketEventListener(UserStatusService userStatusService, UserRepository userRepository, SimpMessagingTemplate messagingTemplate) {
        this.userStatusService = userStatusService;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        Principal user = event.getUser();
        if (user != null) {
            String username = user.getName();
            Optional<User> userOptional = userRepository.findByUsername(username);

            userOptional.ifPresent(u -> {
                userStatusService.updateStatus(u.getId(), OnlineStatus.ONLINE);
                messagingTemplate.convertAndSend("/topic/status",
                        userStatusService.getUserStatusWithDetails(u.getId()));
            });
        }

    }
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        Principal user = event.getUser();
        if (user != null) {
            String username = user.getName();
            Optional<User> userOptional = userRepository.findByUsername(username);

            userOptional.ifPresent(u -> {
                userStatusService.updateStatus(u.getId(),OnlineStatus.OFFLINE);
                messagingTemplate.convertAndSend("/topic/status",
                        userStatusService.getUserStatusWithDetails(u.getId()));
            });
        }
    }
}
