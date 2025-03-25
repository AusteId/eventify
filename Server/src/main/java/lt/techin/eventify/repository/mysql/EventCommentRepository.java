package lt.techin.eventify.repository.mysql;

import lt.techin.eventify.model.EventComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventCommentRepository extends JpaRepository<EventComment, Long> {
}
