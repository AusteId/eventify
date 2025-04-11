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
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MessageService {
    private static final Logger logger = LoggerFactory.getLogger(MessageService.class);

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final MessageMapper messageMapper;
    private final SimpMessagingTemplate messagingTemplate;

    private final Map<Long, User> userCache = new ConcurrentHashMap<>();
    private final Map<String, String> usernameToIdCache = new ConcurrentHashMap<>();

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

        if (usernameToIdCache.containsKey(username)) {
            Long userId = Long.valueOf(usernameToIdCache.get(username));
            if (userCache.containsKey(userId)) {
                return userCache.get(userId);
            }
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.error("User not found: {}", username);
                    return new UsernameNotFoundException("User not found: " + username);
                });

        userCache.put(user.getId(), user);
        usernameToIdCache.put(username, user.getId().toString());

        return user;
    }

    private User getUserById(Long userId) {
        if (userCache.containsKey(userId)) {
            return userCache.get(userId);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found: " + userId));

        userCache.put(userId, user);
        usernameToIdCache.put(user.getUsername(), userId.toString());

        return user;
    }

    public Message sendMessage(Long recipientId, MessageRequest request, Authentication auth) {
        User sender = authenticate(auth);
        User recipient = getUserById(recipientId);

        logger.debug("Sending message from user: {} to recipient: {}",
                sender.getUsername(), recipient.getUsername());

        Message message = MessageMapper.toEntity(request);
        message.setSenderId(sender.getId());
        message.setRecipientId(recipientId);
        message.setRead(false);
        message.setTimestamp(LocalDateTime.now());

        String conversationId = generateConversationId(sender.getId(), recipientId);
        message.setConversationId(conversationId);

        try {
            Message savedMessage = messageRepository.save(message);
            logger.debug("Message saved to MongoDB with ID: {}", savedMessage.getId());

            return savedMessage;
        } catch (Exception e) {
            logger.error("Error saving message: ", e);
            throw e;
        }
    }

    private String generateConversationId(Long userId1, Long userId2) {
        return userId1 < userId2
                ? userId1 + "_" + userId2
                : userId2 + "_" + userId1;
    }

    public Page<MessageResponse> getConversation(Long userId1, Long userId2, Pageable pageable, Authentication auth) {

        User currentUser = authenticate(auth);

        if (!Objects.equals(currentUser.getId(), userId1) && !Objects.equals(currentUser.getId(), userId2)) {
            logger.error("User {} attempted to access conversation between {} and {}",
                    currentUser.getId(), userId1, userId2);
            throw new IllegalArgumentException("Cannot access conversation for other users");
        }

        String conversationId = generateConversationId(userId1, userId2);
        logger.debug("Getting conversation with ID: {}", conversationId);

        Page<Message> messages = messageRepository.findByConversationIdOrderByTimestampDesc(conversationId, pageable);

        User user1 = getUserById(userId1);
        User user2 = getUserById(userId2);

        List<MessageResponse> responses = messages.getContent().parallelStream()
                .map(messageMapper::toDTO)
                .toList();

        if (currentUser.getId().equals(userId2)) {
            markMessagesAsReadInBackground(userId1, userId2, conversationId);
        }

        return new PageImpl<>(responses, pageable, messages.getTotalElements());
    }


    private void markMessagesAsReadInBackground(Long senderId, Long recipientId, String conversationId) {
        List<Message> unreadMessages = messageRepository.findByConversationIdAndRecipientIdAndReadFalse(
                conversationId, recipientId
        );

        if (unreadMessages.isEmpty()) {
            logger.debug("No unread messages to mark as read");
            return;
        }

        logger.debug("Found {} unread messages to mark as read", unreadMessages.size());

        new Thread(() -> {
            try {
                for (Message message : unreadMessages) {
                    message.setRead(true);
                }
                messageRepository.saveAll(unreadMessages);

                User sender = getUserById(senderId);

                messagingTemplate.convertAndSendToUser(
                        sender.getUsername(),
                        "/queue/read-receipts",
                        conversationId
                );

                logger.debug("Read receipt sent to: {}", sender.getUsername());
            } catch (Exception e) {
                logger.error("Error marking messages as read: ", e);
            }
        }).start();
    }

    public void markMessagesAsRead(Long senderId, Long recipientId, Authentication auth) {
        User currentUser = authenticate(auth);

        if (!currentUser.getId().equals(recipientId)) {
            logger.error("User {} attempted to mark messages as read for recipient {}",
                    currentUser.getId(), recipientId);
            throw new IllegalArgumentException("Cannot mark messages as read for other users");
        }

        String conversationId = generateConversationId(senderId, recipientId);
        logger.debug("Marking messages as read in conversation: {}", conversationId);

        List<Message> unreadMessages = messageRepository.findByConversationIdAndRecipientIdAndReadFalse(
                conversationId, recipientId
        );

        if (unreadMessages.isEmpty()) {
            logger.debug("No unread messages to mark as read");
            return;
        }

        logger.debug("Found {} unread messages to mark as read", unreadMessages.size());

        for (Message message : unreadMessages) {
            message.setRead(true);
        }
        messageRepository.saveAll(unreadMessages);
        logger.debug("All messages marked as read");

        User sender = getUserById(senderId);

        messagingTemplate.convertAndSendToUser(
                sender.getUsername(),
                "/queue/read-receipts",
                conversationId
        );

        messagingTemplate.convertAndSend(
                "/topic/conversations/" + conversationId + "/read",
                recipientId
        );

        logger.debug("Read receipts sent");
    }

    public void clearUserCache() {
        userCache.clear();
        usernameToIdCache.clear();
        logger.debug("User cache cleared");
    }

    public Map<String, Integer> getUnreadMessageCounts(Authentication auth) {
        User currentUser = authenticate(auth);
        Long userId = currentUser.getId();

        logger.debug("Getting unread message counts for user: {}", userId);

        Map<String, Integer> unreadCounts = new HashMap<>();

        List<Message> unreadMessages = messageRepository.findByRecipientIdAndReadFalse(userId);

        for (Message message : unreadMessages) {
            String senderId = String.valueOf(message.getSenderId());
            unreadCounts.put(senderId, unreadCounts.getOrDefault(senderId, 0) + 1);
        }

        logger.debug("Found unread message counts: {}", unreadCounts);
        return unreadCounts;
    }

    public Message updateMessage(String messageId, String newContent, Authentication auth) {
        User currentUser = authenticate(auth);

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new NotFoundException("Message not found: " + messageId));

        if (!message.getSenderId().equals(currentUser.getId())) {
            logger.error("User {} attempted to edit a message they didn't send: {}",
                    currentUser.getId(), messageId);
            throw new IllegalArgumentException("Cannot edit messages sent by other users");
        }

        if (message.isDeleted()) {
            logger.error("User {} attempted to edit a deleted message: {}",
                    currentUser.getId(), messageId);
            throw new IllegalArgumentException("Cannot edit a deleted message");
        }

        if (!message.isEdited()) {
            message.setOriginalContent(message.getContent());
        }

        message.setContent(newContent);
        message.setEdited(true);
        message.setEditedAt(LocalDateTime.now());

        Message updatedMessage = messageRepository.save(message);
        logger.debug("Message updated: {}", messageId);

        return updatedMessage;
    }

    public Message deleteMessage(String messageId, Authentication auth) {
        User currentUser = authenticate(auth);

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new NotFoundException("Message not found: " + messageId));

        if (!message.getSenderId().equals(currentUser.getId())) {
            logger.error("User {} attempted to delete a message they didn't send: {}",
                    currentUser.getId(), messageId);
            throw new IllegalArgumentException("Cannot delete messages sent by other users");
        }

        if (message.isDeleted()) {
            logger.error("User {} attempted to delete an already deleted message: {}",
                    currentUser.getId(), messageId);
            throw new IllegalArgumentException("Message is already deleted");
        }

        message.setDeleted(true);
        message.setDeletedAt(LocalDateTime.now());

        Message deletedMessage = messageRepository.save(message);
        logger.debug("Message deleted: {}", messageId);

        return deletedMessage;
    }
}