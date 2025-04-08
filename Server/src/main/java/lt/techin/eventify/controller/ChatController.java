package lt.techin.eventify.controller;

import lt.techin.eventify.dto.message.MessageMapper;
import lt.techin.eventify.dto.message.MessageRequest;
import lt.techin.eventify.dto.message.MessageResponse;
import lt.techin.eventify.exception.NotFoundException;
import lt.techin.eventify.model.Message;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.mysql.UserRepository;
import lt.techin.eventify.service.MessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;

@Controller
public class ChatController {
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final UserRepository userRepository;
    private final MessageMapper messageMapper;

    public ChatController(SimpMessagingTemplate messagingTemplate, MessageService messageService,
                          UserRepository userRepository, MessageMapper messageMapper) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
        this.userRepository = userRepository;
        this.messageMapper = messageMapper;
    }

    @MessageMapping("/chat/{recipientId}")
    public void sendMessage(@DestinationVariable Long recipientId,
                            @Payload MessageRequest messageRequest,
                            Authentication authentication) {
        if (authentication == null) {
            logger.error("Authentication is null in sendMessage");
            return;
        }

        String username = authentication.getName();
        logger.debug("Processing message from user: {} to recipient: {}", username, recipientId);

        try {

            User sender = userRepository.findByUsername(username)
                    .orElseThrow(() -> new NotFoundException("Sender not found: " + username));

            User recipient = userRepository.findById(recipientId)
                    .orElseThrow(() -> new NotFoundException("Recipient not found: " + recipientId));

            Message message = messageService.sendMessage(recipientId, messageRequest, authentication);
            MessageResponse messageResponse = messageMapper.toDTO(message);

            String conversationId = messageResponse.conversationId();
            logger.debug("Created message with ID: {}, conversationId: {}",
                    message.getId(), conversationId);

            logger.debug("Sending message to recipient: {}", recipient.getUsername());
            messagingTemplate.convertAndSendToUser(
                    recipient.getUsername(),
                    "/queue/messages",
                    messageResponse
            );
            messagingTemplate.convertAndSend(
                    "/topic/conversations/" + conversationId,
                    messageResponse
            );

            Map<String, Object> ack = new HashMap<>();
            ack.put("messageId", message.getId());
            ack.put("status", "delivered");
            ack.put("timestamp", message.getTimestamp());

            messagingTemplate.convertAndSendToUser(
                    sender.getUsername(),
                    "/queue/ack",
                    ack
            );

            logger.debug("Message sent successfully: {}", message.getId());
        } catch (Exception e) {
            logger.error("Error processing message: ", e);

            if (authentication != null) {
                Map<String, Object> error = new HashMap<>();
                error.put("status", "error");
                error.put("message", "Failed to send message: " + e.getMessage());

                messagingTemplate.convertAndSendToUser(
                        authentication.getName(),
                        "/queue/errors",
                        error
                );
            }
        }
    }

    @MessageMapping("/messages/{senderId}/read")
    public void markMessagesAsRead(@DestinationVariable Long senderId,
                                   Authentication authentication) {
        if (authentication == null) {
            logger.error("Authentication is null in markMessagesAsRead");
            return;
        }

        String username = authentication.getName();
        logger.debug("Marking messages as read from sender: {} by user: {}", senderId, username);

        try {
            User recipient = userRepository.findByUsername(username)
                    .orElseThrow(() -> new NotFoundException("User not found: " + username));

            messageService.markMessagesAsRead(senderId, recipient.getId(), authentication);

            String conversationId = recipient.getId() < senderId ?
                    recipient.getId() + "_" + senderId :
                    senderId + "_" + recipient.getId();

            logger.debug("Messages marked as read successfully in conversation: {}", conversationId);

            User sender = userRepository.findById(senderId)
                    .orElseThrow(() -> new NotFoundException("Sender not found: " + senderId));

            messagingTemplate.convertAndSendToUser(
                    sender.getUsername(),
                    "/queue/read-receipts",
                    conversationId
            );

            messagingTemplate.convertAndSend(
                    "/topic/conversations/" + conversationId + "/read",
                    recipient.getId()
            );
        } catch (Exception e) {
            logger.error("Error marking messages as read: ", e);
        }
    }
}