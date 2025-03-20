package lt.techin.eventify.repository;

import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long>, EventQueryDslRepository {
    List<Event> findByOrganizer(User user);
}
