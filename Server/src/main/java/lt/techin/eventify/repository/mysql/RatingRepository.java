package lt.techin.eventify.repository.mysql;

import lt.techin.eventify.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

  Optional<Rating> findByRaterIdAndEventId(Long raterId, Long eventId);
}
