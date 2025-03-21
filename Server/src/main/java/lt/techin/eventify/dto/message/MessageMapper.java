package lt.techin.eventify.dto.message;

import lt.techin.eventify.exception.NotFoundException;
import lt.techin.eventify.model.Message;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.mysql.UserRepository;

public class MessageMapper {

  public static Message toEntity(MessageRequest dto) {
    Message message = new Message();
    message.setContent(dto.content());
    message.setRecipientId(dto.recipientId());
    return message;
  }

  public static MessageResponse toDTO(Message message,UserRepository userRepository) {
    return new MessageResponse(
            message.getSenderId(),
            message.getRecipientId(),
            userRepository.findById(message.getSenderId())
                    .map(User::getUsername)
                    .orElseThrow(() -> new NotFoundException("Sender not found")),
            userRepository.findById(message.getRecipientId())
                    .map(User::getUsername)
                    .orElseThrow(() -> new NotFoundException("Recipient not found")),
            message.getTimestamp(),
            message.getConversationId(),
            message.isRead(),
            message.getOnlineStatus(),
            message.isTyping(),
            message.getLastSeen()
    );
  }
}
