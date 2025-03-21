package lt.techin.eventify.service;

import lt.techin.eventify.dto.message.MessageMapper;
import lt.techin.eventify.dto.message.MessageRequest;
import lt.techin.eventify.dto.message.MessageResponse;
import lt.techin.eventify.exception.NotFoundException;
import lt.techin.eventify.exception.UsernameNotFoundException;
import lt.techin.eventify.model.Message;
import lt.techin.eventify.model.OnlineStatus;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.mongodb.MessageRepository;
import lt.techin.eventify.repository.mysql.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    private User authenticate() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      return userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new UsernameNotFoundException("Sender not found"));
    }

    public Message sendMessage(Long recipientId, MessageRequest request) {
        User sender = authenticate();
         userRepository.findById(recipientId)
                .orElseThrow(() -> new NotFoundException("Recipient not found"));
        Message message = MessageMapper.toEntity(request);
        message.setSenderId(sender.getId());
        message.setRead(false);
        message.setTimestamp(LocalDateTime.now());
        message.setOnlineStatus(OnlineStatus.ONLINE);
        message.setTyping(false);
        message.setLastSeen(LocalDateTime.now());

        String conversationId = sender.getId() < recipientId
                ? sender.getId() + "_" + recipientId
                : recipientId + "_" + sender.getId();
        message.setConversationId(conversationId);
        return messageRepository.save(message);
    }

    public Page<MessageResponse> getConversation(Long userId2, Pageable pageable) {
        User user1 = authenticate();
        String conversationId = user1.getId() < userId2
                ? user1.getId() + "_" + userId2
                : userId2 + "_" + user1.getId();
       Page<Message> messages = messageRepository.findByConversationIdOrderByTimestampDesc(conversationId,pageable);
        List<MessageResponse> responses = messages
                .stream()
                .map(message -> MessageMapper.toDTO(message,userRepository))
                .toList();
        return new PageImpl<>(responses,pageable,messages.getTotalElements());
    }
}
