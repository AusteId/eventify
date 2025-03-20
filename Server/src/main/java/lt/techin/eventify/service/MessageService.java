package lt.techin.eventify.service;

import lt.techin.eventify.exception.NotFoundException;
import lt.techin.eventify.model.Message;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.mongodb.MessageRepository;
import lt.techin.eventify.repository.mysql.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public Message sendMessage(Long senderId, Long recipientId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new NotFoundException("Sender not found"));
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new NotFoundException("Recipient not found"));
        Message message = new Message();
        message.setSenderId(senderId);
        message.setRecipientId(recipientId);
        message.setContent(content);
        message.setRead(false);
        message.setTimestamp(LocalDateTime.now());

        String conversationId = senderId < recipientId
                ? senderId + "_" + recipientId
                : recipientId + "_" + senderId;
        message.setConversationId(conversationId);
        return messageRepository.save(message);
    }

    public Page<Message> getConversation(Long userId1, Long userId2, Pageable pageable) {
        String conversationId = userId1 < userId2
                ? userId1 + "_" + userId2
                : userId2 + "_" + userId1;
        return messageRepository.findByConversationIdOrderByTimestampDesc(conversationId,pageable);
    }
}
