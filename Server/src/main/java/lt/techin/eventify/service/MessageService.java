package lt.techin.eventify.service;

import lt.techin.eventify.dto.message.MessageMapper;
import lt.techin.eventify.dto.message.MessageRequest;
import lt.techin.eventify.dto.message.MessageResponse;
import lt.techin.eventify.exception.NotFoundException;
import lt.techin.eventify.exception.UsernameNotFoundException;
import lt.techin.eventify.model.Message;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.mongodb.MessageRepository;
import lt.techin.eventify.repository.mysql.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {
    private static final Logger logger = LoggerFactory.getLogger(MessageService.class);

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final MessageMapper messageMapper;
    private final SimpMessagingTemplate messagingTemplate;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository, MessageMapper messageMapper, SimpMessagingTemplate messagingTemplate) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.messageMapper = messageMapper;
        this.messagingTemplate = messagingTemplate;
    }

    private User authenticate(Authentication providedAuth) {
        Authentication authentication = providedAuth != null ?
                providedAuth : SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            logger.error("Authentication is null in MessageService.authenticate()");
            throw new UsernameNotFoundException("User not authenticated");
        }

        String username = authentication.getName();
        logger.debug("Authenticating user: {}", username);

        return userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.error("User not found: {}", username);
                    return new UsernameNotFoundException("User not found: " + username);
                });
    }

    public Message sendMessage(Long recipientId, MessageRequest request, Authentication auth) {
        User sender = authenticate(auth);
        logger.debug("Sending message from user: {} to recipient: {}", sender.getUsername(), recipientId);

        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new NotFoundException("Recipient not found: " + recipientId));

        Message message = MessageMapper.toEntity(request);
        message.setSenderId(sender.getId());
        message.setRecipientId(recipientId);
        message.setRead(false);
        message.setTimestamp(LocalDateTime.now());

        String conversationId = generateConversationId(sender.getId(), recipientId);
        message.setConversationId(conversationId);

        try {
            message = messageRepository.save(message);
            logger.debug("Message saved to MongoDB with ID: {}", message.getId());
            return message;
        } catch (Exception e) {
            logger.error("Error saving message to MongoDB: ", e);
            throw e;
        }
    }

    private String generateConversationId(Long userId1, Long userId2) {
        return userId1 < userId2
                ? userId1 + "_" + userId2
                : userId2 + "_" + userId1;
    }

    public Page<MessageResponse> getConversation(Long userId1, Long userId2, Pageable pageable,Authentication auth) {
        User currentUser = authenticate(auth);
        if (currentUser.getId() != userId1 && currentUser.getId() != userId2) {
            logger.error("User {} attempted to access conversation between {} and {}",
                    currentUser.getId(), userId1, userId2);
            throw new IllegalArgumentException("Cannot access conversation for other users");
        }

        String conversationId = generateConversationId(userId1, userId2);
        logger.debug("Getting conversation with ID: {}", conversationId);

        Page<Message> messages = messageRepository.findByConversationIdOrderByTimestampDesc(conversationId, pageable);
        List<MessageResponse> responses = messages
                .stream()
                .map(messageMapper::toDTO)
                .toList();

        return new PageImpl<>(responses, pageable, messages.getTotalElements());
    }

    public void markMessagesAsRead(Long senderId, Long recipientId, Authentication auth) {
        User currentUser = authenticate(auth);

        if (currentUser.getId() != recipientId) {
            logger.error("User {} attempted to mark messages as read for recipient {}",
                    currentUser.getId(), recipientId);
            throw new IllegalArgumentException("Cannot mark messages as read for other users");
        }

        String conversationId = generateConversationId(senderId, recipientId);
        logger.debug("Marking messages as read in conversation: {}", conversationId);

        List<Message> unreadMessages = messageRepository.findByConversationIdAndRecipientIdAndReadFalse(
                conversationId, recipientId
        );

        logger.debug("Found {} unread messages to mark as read", unreadMessages.size());

        unreadMessages.forEach(message -> {
            message.setRead(true);
            messageRepository.save(message);

            MessageResponse response = messageMapper.toDTO(message);
            User sender = userRepository.findById(message.getSenderId())
                    .orElseThrow(() -> new NotFoundException("Sender not found: " + message.getSenderId()));

            messagingTemplate.convertAndSendToUser(
                    sender.getUsername(),
                    "/queue/read-receipts",
                    response
            );
        });
    }
}
