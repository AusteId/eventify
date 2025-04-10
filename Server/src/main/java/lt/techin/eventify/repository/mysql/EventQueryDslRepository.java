package lt.techin.eventify.repository.mysql;

import lt.techin.eventify.dto.event.EventMapSummary;
import lt.techin.eventify.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EventQueryDslRepository {

  Page<Event> findEventsByFilters(String categoryName, String city, String startDateTime,
                                  String endDateTime, String experienceLevel,
                                  Integer minAge, Integer maxAge, String searchTerm, Pageable pageable);

  List<EventMapSummary> findAllEventsForMap(String categoryName, String city, String startDateTime,
                                            String endDateTime, String experienceLevel,
                                            Integer minAge, Integer maxAge, String searchTerm);

  Page<Event> findEventsByOrganizer(Long userId, Pageable pageable);

  Page<Event> findEventsByParticipant(Long userId, Pageable pageable);
}
