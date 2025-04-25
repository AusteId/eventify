package lt.techin.eventify.repository.mysql;

import lt.techin.eventify.model.EventComment;
import lt.techin.eventify.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventCommentRepository extends JpaRepository<EventComment, Long> {
    @Query("SELECT c FROM EventComment c WHERE c.user = :user AND " +
            "(:searchTerm IS NULL OR :searchTerm = '' OR " +
            "LOWER(c.comment) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<EventComment> findByUserWithSearch(@Param("user") User user,
                                            @Param("searchTerm") String searchTerm,
                                            Pageable pageable);
}
