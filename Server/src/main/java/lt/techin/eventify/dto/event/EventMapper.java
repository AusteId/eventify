package lt.techin.eventify.dto.event;

import lt.techin.eventify.model.Event;
import org.springframework.stereotype.Component;

@Component
public class EventMapper {
  public EventResponse toEventResponse(Event event) {
    return new EventResponse(
            event.getId(),
            event.getCategory(),
            event.getOrganizer(),
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
            event.getPhotoPath()
    );
  }

  public Event toEvent(CreateEventRequest event) {
    return new Event(
            event.category(),
            event.organizer(),
            event.name(),
            event.startDateTime(),
            event.endDateTime(),
            null,
            event.description(),
            event.minAge(),
            event.maxAge(),
            event.experienceLevel(),
            event.maxParticipants(),
            event.city(),
            event.address(),
            event.photoPath()
    );
  }

}
