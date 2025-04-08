package lt.techin.eventify.controller;

import lt.techin.eventify.dto.user.ChatContactDTO;
import lt.techin.eventify.dto.user.UserSearchDTO;
import lt.techin.eventify.model.User;
import lt.techin.eventify.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/chat/users")
public class ChatUsersController {
    private static final Logger logger = LoggerFactory.getLogger(ChatUsersController.class);
    private final UserService userService;

    public ChatUsersController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<ChatContactDTO>> getChatContacts(
            @RequestParam(defaultValue = "20") int limit,
            Authentication authentication) {

        if (authentication == null) {
            logger.error("Authentication is null in getChatContacts");
            return ResponseEntity.status(401).body(Collections.emptyList());
        }

        try {
            User currentUser = userService.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<ChatContactDTO> contacts = userService.findChatContacts(currentUser.getId(), limit);
            logger.debug("Returning {} chat contacts for user {}", contacts.size(), currentUser.getUsername());
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            logger.error("Error getting chat contacts", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserSearchDTO>> searchUsers(
            @RequestParam String query,
            @RequestParam(defaultValue = "5") int limit,
            Authentication authentication) {

        if (authentication == null) {
            logger.error("Authentication is null in searchUsers");
            return ResponseEntity.status(401).body(Collections.emptyList());
        }

        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        try {
            User currentUser = userService.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<UserSearchDTO> results = userService.searchUsers(query, currentUser.getId(), limit);
            logger.debug("Found {} users matching query '{}' for user {}",
                    results.size(), query, currentUser.getUsername());
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            logger.error("Error searching users", e);
            return ResponseEntity.badRequest().build();
        }
    }
}