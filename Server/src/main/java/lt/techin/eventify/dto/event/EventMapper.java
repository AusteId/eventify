package lt.techin.eventify.dto.event;

import lt.techin.eventify.dto.category.CategoryMapper;
import lt.techin.eventify.dto.registrationToEvent.RegistrationToEventMapper;
import lt.techin.eventify.dto.registrationToEvent.RegistrationToEventResponse;
import lt.techin.eventify.dto.user.UserMapper;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class EventMapper {

  private final UserMapper userMapper;
  private final CategoryMapper categoryMapper;

  public EventMapper(UserMapper userMapper, CategoryMapper categoryMapper) {
    this.userMapper = userMapper;
    this.categoryMapper = categoryMapper;
  }

  public EventResponse toEventResponse(Event event) {

    List<RegistrationToEventResponse> registrations = event.getRegistrations().stream()
            .map(RegistrationToEventMapper::toEventRegistrationResponse)
            .collect(Collectors.toList());

    return new EventResponse(
            event.getId(),
            categoryMapper.toDTO(event.getCategory()),
            userMapper.toUserResponse(event.getOrganizer()),
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
            event.getPhotoPath(),
            registrations,
            false
    );
  }

  public Event toEvent(CreateEventRequest createEventRequest) {
    return new Event(
            createEventRequest.category(),
            createEventRequest.organizer(),
            createEventRequest.name(),
            createEventRequest.startDateTime(),
            createEventRequest.endDateTime(),
            null,
            createEventRequest.description(),
            createEventRequest.minAge(),
            createEventRequest.maxAge(),
            createEventRequest.experienceLevel(),
            createEventRequest.maxParticipants(),
            createEventRequest.city(),
            createEventRequest.address(),
            createEventRequest.photoPath()

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
            event.getPhotoPath()
    );
  }

}
