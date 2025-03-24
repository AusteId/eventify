package lt.techin.eventify.repository.mysql;

import lt.techin.eventify.model.RegistrationToEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationToEventRepository extends JpaRepository<RegistrationToEvent, Long> {
  int countByEventId(Long id);
}
