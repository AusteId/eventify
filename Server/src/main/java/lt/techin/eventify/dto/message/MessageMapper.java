package lt.techin.eventify.dto.message;

import lt.techin.eventify.exception.NotFoundException;
import lt.techin.eventify.model.Message;
import lt.techin.eventify.model.User;
import lt.techin.eventify.model.UserStatus;
import lt.techin.eventify.repository.mysql.UserRepository;
import lt.techin.eventify.service.UserStatusService;
import org.springframework.context.annotation.Configuration;


@Configuration
public class MessageMapper {
  private final UserRepository userRepository;
  private final UserStatusService userStatusService;

  public MessageMapper(UserRepository userRepository, UserStatusService userStatusService) {
    this.userRepository = userRepository;
    this.userStatusService = userStatusService;
  }

  public MessageResponse toDTO(Message message) {
    User sender = userRepository.findById(message.getSenderId())
            .orElseThrow(() -> new NotFoundException("Sender not found"));

    User recipient = userRepository.findById(message.getRecipientId())
            .orElseThrow(() -> new NotFoundException("Recipient not found"));

    UserStatus senderStatus = userStatusService.getUserStatus(sender.getId());

    return new MessageResponse(
            message.getId(),
            sender.getId(),
            recipient.getId(),
            sender.getUsername(),
            recipient.getUsername(),
            message.getContent(),
            message.getTimestamp(),
            message.getConversationId(),
            message.isRead(),
            senderStatus.getStatus(),
            senderStatus.isTyping(),
            senderStatus.getLastSeen(),
            message.isDeleted(),
            message.getDeletedAt(),
            message.isEdited(),
            message.getEditedAt()
    );
  }


  public static Message toEntity(MessageRequest dto) {
    Message message = new Message();
    message.setContent(dto.content());
    message.setRecipientId(dto.recipientId());
    return message;
  }
}