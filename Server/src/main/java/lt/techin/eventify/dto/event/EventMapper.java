package lt.techin.eventify.dto.event;

import lt.techin.eventify.dto.category.CategoryMapper;
import lt.techin.eventify.dto.user.UserMapper;
import lt.techin.eventify.model.Category;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.User;
import org.springframework.stereotype.Component;

@Component
public class EventMapper {

  private final UserMapper userMapper;
  private final CategoryMapper categoryMapper;

  public EventMapper(UserMapper userMapper, CategoryMapper categoryMapper) {
    this.userMapper = userMapper;
    this.categoryMapper = categoryMapper;
  }

  public EventResponse toEventResponse(Event event) {
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
            event.getPhotoPath()
    );
  }

  public Event toEvent(CreateEventRequest event, Category category, User organizer) {
    return new Event(
            category,
            organizer,
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
