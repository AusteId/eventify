package lt.techin.eventify.controller;

import lt.techin.eventify.dto.userStatus.UserStatusDTO;
import lt.techin.eventify.model.OnlineStatus;
import lt.techin.eventify.model.User;
import lt.techin.eventify.model.UserStatus;
import lt.techin.eventify.repository.mysql.UserRepository;
import lt.techin.eventify.service.UserStatusService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users/status")
public class UserStatusRestController {
    private static final Logger logger = LoggerFactory.getLogger(UserStatusRestController.class);

    private final UserStatusService userStatusService;
    private final UserRepository userRepository;

    public UserStatusRestController(UserStatusService userStatusService, UserRepository userRepository) {
        this.userStatusService = userStatusService;
        this.userRepository = userRepository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserStatusDTO> getUserStatus(@PathVariable Long userId) {
        logger.debug("GET request for user status: {}", userId);
        return ResponseEntity.ok(userStatusService.getUserStatusWithDetails(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserStatusDTO>> getAllUserStatuses(Authentication authentication) {
        logger.debug("GET request for all user statuses");

        List<User> users = userRepository.findAll();

        List<UserStatusDTO> statuses = users.stream()
                .map(user -> userStatusService.getUserStatusWithDetails(user.getId()))
                .toList();

        logger.debug("Returning {} user statuses", statuses.size());
        return ResponseEntity.ok(statuses);
    }

    @GetMapping("/online")
    public ResponseEntity<List<UserStatusDTO>> getOnlineUsers(Authentication authentication) {
        logger.debug("GET request for online users");

        List<UserStatus> onlineUsers = userStatusService.getAllOnlineUsers();

        List<UserStatusDTO> onlineStatuses = onlineUsers.stream()
                .map(status -> userStatusService.getUserStatusWithDetails(status.getUserId()))
                .toList();

        logger.debug("Returning {} online users", onlineStatuses.size());
        return ResponseEntity.ok(onlineStatuses);
    }
}