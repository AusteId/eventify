package lt.techin.eventify.repository;

import lt.techin.eventify.model.ProfileComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileCommentRepository extends JpaRepository<ProfileComment, Long> {
}
