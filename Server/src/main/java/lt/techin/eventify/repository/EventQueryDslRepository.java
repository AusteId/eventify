package lt.techin.eventify.repository;

import lt.techin.eventify.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EventQueryDslRepository {

  public Page<Event> findEventsByFilters(String categoryName, String city, String startDateTime,
                                         String endDateTime, String experienceLevel,
                                         Integer minAge, Integer maxAge, String searchTerm, Pageable pageable);

}
