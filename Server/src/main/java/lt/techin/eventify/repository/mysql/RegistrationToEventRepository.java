package lt.techin.eventify.repository.mysql;

import lt.techin.eventify.model.RegistrationToEvent;
import lt.techin.eventify.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistrationToEventRepository extends JpaRepository<RegistrationToEvent, Long> {
  int countByEventId(Long id);
  boolean existsByUserIdAndEventId(Long userId, Long eventId);
  List<User> findAllByEventId(Long eventId);
}
