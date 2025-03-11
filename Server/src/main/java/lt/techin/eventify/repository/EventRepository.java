package lt.techin.eventify.repository;

import lt.techin.eventify.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}
