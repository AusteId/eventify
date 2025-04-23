package lt.techin.eventify.dto.event;

import lombok.AllArgsConstructor;
import lt.techin.eventify.dto.category.CategoryMapper;
import lt.techin.eventify.dto.registrationToEvent.RegistrationToEventMapper;
import lt.techin.eventify.dto.registrationToEvent.UserRegisteredToEventResponse;
import lt.techin.eventify.dto.user.UserMapper;
import lt.techin.eventify.model.Category;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.mysql.CategoryRepository;
import lt.techin.eventify.repository.mysql.RegistrationToEventRepository;
import lt.techin.eventify.repository.mysql.UserRepository;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Component
public class EventMapper {

  private final UserMapper userMapper;
  private final CategoryMapper categoryMapper;
  private final CategoryRepository categoryRepository;
  private final UserRepository userRepository;
  private final RegistrationToEventMapper registrationToEventMapper;
  private final RegistrationToEventRepository registrationToEventRepository;

  public EventResponse toEventResponse(Event event) {

    List<UserRegisteredToEventResponse> registrations = event.getRegistrations()
            .stream()
            .map(registrationToEventMapper::toUserRegisteredToEvent)
            .toList();

    Double latitude = event.getLocation() != null ? event.getLocation().getY() : null;
    Double longitude = event.getLocation() != null ? event.getLocation().getX() : null;

    return new EventResponse(
            event.getId(),
            event.getName(),
            event.getStartDateTime(),
            event.getEndDateTime(),
            event.getCreatedAt(),
            event.getDescription(),
            event.getMinAge(),
            event.getMaxAge(),
            event.getExperienceLevel(),
            event.getMaxParticipants(),
            event.getCity(),
            event.getAddress(),
            categoryMapper.toDTO(event.getCategory()),
            userMapper.toUserResponse(event.getOrganizer()),
            registrations,
            false,
            latitude,
            longitude
    );
  }

  public Event toEvent(CreateEventRequest event, Category category, User organizer) {

    GeometryFactory geometryFactory = new GeometryFactory();
    Point location = null;
    if (event.latitude() != null && event.longitude() != null) {
      location = geometryFactory.createPoint(new org.locationtech.jts.geom.Coordinate(event.longitude(), event.latitude()));
    }

    return new Event(
            category,
            organizer,
            event.name(),
            event.startDateTime(),
            event.endDateTime(),
            event.description(),
            event.minAge(),
            event.maxAge(),
            event.experienceLevel(),
            event.maxParticipants(),
            event.city(),
            event.address(),
            location
    );
  }

  public GetEventResponse toGetEventResponse(Event event) {
    return new GetEventResponse(
            event.getId(),
            event.getName(),
            event.getStartDateTime(),
            event.getEndDateTime(),
            event.getDescription(),
            event.getMinAge(),
            event.getMaxAge(),
            event.getExperienceLevel(),
            event.getMaxParticipants(),
            event.getCity(),
            event.getAddress()
    );
  }


  public EventMapResponse toEventMapResponse(EventMapSummary event) {

    if (event == null) {
      return null;
    }

    Double latitude = event.location() != null ? event.location().getY() : null;
    Double longitude = event.location() != null ? event.location().getX() : null;

    return new EventMapResponse(
            event.id(),
            event.name(),
            event.city(),
            event.address(),
            latitude,
            longitude,
            event.startDateTime()
    );
  }

  public EventSummaryResponse toEventSummaryResponse(Event event) {

    boolean isEnded = event.getEndDateTime() != null && event.getEndDateTime().isBefore(LocalDateTime.now());
    int currentParticipants = registrationToEventRepository.countByEventId(event.getId());

    String experienceLevel = event.getExperienceLevel() != null
            ? Arrays.stream(event.getExperienceLevel().split("_"))
            .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
            .collect(Collectors.joining(" "))
            : "All Welcome";

    return new EventSummaryResponse(
            event.getId(),
            event.getName(),
            event.getStartDateTime(),
            event.getEndDateTime(),
            event.getDescription(),
            event.getCity(),
            event.getMinAge(),
            event.getMaxAge(),
            event.getExperienceLevel(),
            isEnded,
            currentParticipants,
            event.getMaxParticipants()
    );
  }
}
