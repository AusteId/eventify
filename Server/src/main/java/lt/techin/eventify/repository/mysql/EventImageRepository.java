package lt.techin.eventify.repository.mysql;


import lt.techin.eventify.model.EventImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventImageRepository extends JpaRepository<EventImage, Long> {
  Optional<EventImage> findEventImageById(Long eventId);
}
