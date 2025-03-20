package lt.techin.eventify.repository;

import lt.techin.eventify.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface EventQueryDslRepository {

  public Page<Event> findEventsByFilters(String categoryName, String city, LocalDateTime startDateTime,
                                         LocalDateTime endDateTime, String experienceLevel,
                                         Integer minAge, Integer maxAge, String searchTerm, Pageable pageable);

}
