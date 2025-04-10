package lt.techin.eventify.repository.mysql;

import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long>, EventQueryDslRepository {
  List<Event> findByOrganizer(User user);

  Optional<Event> findByNameAndStartDateTime(String name, LocalDateTime time);

  List<Event> findByStartDateTimeBetween(LocalDateTime startDate, LocalDateTime endDate);

  @Query("SELECT e FROM Event e " +
          "WHERE (:age BETWEEN e.minAge AND e.maxAge OR :age IS NULL) " +
          "AND (e.city = :city or :city IS NULL)" +
          "AND (e.startDateTime >= :date)"
  )
  List<Event> findRecommendedEvents(@Param("age") Integer age, @Param("city") String city, @Param("date") LocalDateTime date);

  // For defaults
  @Query("SELECT e.imageKey FROM Event e WHERE e.id = :eventId")
  String findImageKeyById(@Param("eventId") Long eventId);

}
