package lt.techin.eventify.controller;


import lt.techin.eventify.dto.message.MessageRequest;
import lt.techin.eventify.dto.message.MessageResponse;
import lt.techin.eventify.model.Message;
import lt.techin.eventify.service.MessageService;
import lt.techin.eventify.util.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageRestController {
    private static final Logger logger = LoggerFactory.getLogger(MessageRestController.class);

    private final MessageService messageService;

    public MessageRestController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/{senderId}/{recipientId}")
    public ResponseEntity<Page<MessageResponse>> getMessages(
            @PathVariable Long senderId,
            @PathVariable Long recipientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "desc") String direction,
            Authentication authentication) {

        logger.debug("GET request for messages between {} and {}", senderId, recipientId);

        if (authentication == null) {
            logger.error("Authentication is null in getMessages");
            return ResponseEntity.status(401).build();
        }

        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, "timestamp"));

        try {
            Page<MessageResponse> messages = messageService.getConversation(senderId, recipientId, pageable,authentication);
            logger.debug("Returning {} messages between {} and {}",
                    messages.getTotalElements(), senderId, recipientId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            logger.error("Error getting messages: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/unread")
    public ResponseEntity<Map<String, Integer>> getUnreadMessageCounts(Authentication authentication) {
        logger.debug("GET request for unread message counts");

        if (authentication == null) {
            logger.error("Authentication is null in getUnreadMessageCounts");
            return ResponseEntity.status(401).build();
        }

        try {
            Map<String, Integer> unreadCounts = messageService.getUnreadMessageCounts(authentication);
            logger.debug("Returning unread message counts: {}", unreadCounts);
            return ResponseEntity.ok(unreadCounts);
        } catch (Exception e) {
            logger.error("Error getting unread message counts: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{senderId}/{recipientId}/read")
    public ResponseEntity<Void> markMessagesAsRead(
            @PathVariable Long senderId,
            @PathVariable Long recipientId,
            Authentication authentication) {

        logger.debug("POST request to mark messages as read from {} to {}",
                senderId, recipientId);

        if (authentication == null) {
            logger.error("Authentication is null in markMessagesAsRead");
            return ResponseEntity.status(401).build();
        }

        try {
            messageService.markMessagesAsRead(senderId, recipientId,authentication);
            logger.debug("Messages marked as read successfully");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error marking messages as read: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
}
