package lt.techin.eventify.repository.mysql;

import lt.techin.eventify.model.RegistrationToEvent;
import lt.techin.eventify.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RegistrationToEventRepository extends JpaRepository<RegistrationToEvent, Long> {
  int countByEventId(Long id);

  boolean existsByUserIdAndEventId(Long userId, Long eventId);

  List<User> findAllByEventId(Long eventId);

  Optional<RegistrationToEvent> findByUserIdAndEventId(Long userId, Long eventId);

  @Query("SELECT r.event.id, COUNT(r) FROM RegistrationToEvent r WHERE r.event.id IN :eventIds GROUP BY r.event.id")
  List<Object[]> findCountsByEventIds(@Param("eventIds") List<Long> eventIds);
}
