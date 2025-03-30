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
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final UserRepository userRepository;
    private final MessageMapper messageMapper;

    public ChatController(SimpMessagingTemplate messagingTemplate, MessageService messageService, UserRepository userRepository, MessageMapper messageMapper) {
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

            logger.debug("Sending message to recipient: {}", recipient.getUsername());
            messagingTemplate.convertAndSendToUser(
                    recipient.getUsername(),
                    "/queue/messages",
                    messageResponse
            );

            logger.debug("Sending message back to sender: {}", sender.getUsername());
            messagingTemplate.convertAndSendToUser(
                    sender.getUsername(),
                    "/queue/messages",
                    messageResponse
            );

            logger.debug("Message sent successfully: {}", message.getId());
        } catch (Exception e) {
            logger.error("Error processing message: ", e);
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
            logger.debug("Messages marked as read successfully");
        } catch (Exception e) {
            logger.error("Error marking messages as read: ", e);
        }
    }
}
