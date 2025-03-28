package lt.techin.eventify.repository.mysql;

import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long>, EventQueryDslRepository {
  List<Event> findByOrganizer(User user);

  Optional<Event> findByNameAndStartDateTime(String name, LocalDateTime time);


}
