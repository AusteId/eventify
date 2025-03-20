package lt.techin.eventify.repository.mongodb;

import lt.techin.eventify.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MessageRepository extends MongoRepository<Message,String> {
    Page<Message> findByConversationIdOrderByTimestampDesc(String conversationId, Pageable pageable);

    Page<Message> findBySenderIdAndRecipientIdOrderByTimestampDesc(Long senderId, Long recipientId, Pageable pageable);
}
