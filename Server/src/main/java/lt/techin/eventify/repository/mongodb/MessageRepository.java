package lt.techin.eventify.repository.mongodb;

import lt.techin.eventify.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message,String> {
    Page<Message> findByConversationIdOrderByTimestampDesc(String conversationId, Pageable pageable);

    List<Message> findByConversationIdAndRecipientIdAndReadFalse(String conversationId, Long recipientId);

    List<Message> findByRecipientIdAndReadFalse(Long recipientId);

    List<Message> findBySenderIdOrRecipientId(Long senderId, Long recipientId);

}
