package lt.techin.eventify.dto.event;

import lombok.AllArgsConstructor;
import lt.techin.eventify.dto.category.CategoryMapper;
import lt.techin.eventify.dto.registrationToEvent.RegistrationToEventMapper;
import lt.techin.eventify.dto.registrationToEvent.UserRegisteredToEventResponse;
import lt.techin.eventify.dto.user.UserMapper;
import lt.techin.eventify.model.Category;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.EventImage;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.mysql.CategoryRepository;
import lt.techin.eventify.repository.mysql.UserRepository;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.util.List;

import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.GeometryFactory;

@AllArgsConstructor
@Component
public class EventMapper {

  private final UserMapper userMapper;
  private final CategoryMapper categoryMapper;
  private final CategoryRepository categoryRepository;
  private final UserRepository userRepository;
  private final RegistrationToEventMapper registrationToEventMapper;

  public EventResponse toEventResponse(Event event) {

//    List<RegistrationToEventResponse> registrations = event.getRegistrations().stream()
//            .map(registrationToEventMapper::toEventRegistrationResponse)
//            .collect(Collectors.toList());

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
            event.getPhotoPath(),
            categoryMapper.toDTO(event.getCategory()),
            userMapper.toUserResponse(event.getOrganizer()),
            registrations,
            false,
            latitude,
            longitude
    );
  }

  public Event toEvent(CreateEventRequest event, Category category, User organizer) {
//    Category category = categoryRepository.findById(createEventRequest.categoryId()).orElseThrow(() -> new CategoryNotFoundException("category not found for id " + createEventRequest.categoryId()));
//    User organizer = userRepository.findById(createEventRequest.organizerId()).orElseThrow(() -> new UserNotFoundException("user not found for id " + createEventRequest.organizerId()));

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
            event.photoPath(),
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
            event.getPhotoPath()
    );
  }

  public EventImage imageToEntity(CreateEventRequest dto) throws IOException {
    if (dto.picture() != null && !dto.picture().isEmpty()) {
      EventImage eventImage = new EventImage();
      eventImage.setFilename(dto.picture().getOriginalFilename());
      eventImage.setContentType(dto.picture().getContentType());
      eventImage.setFileSize(dto.picture().getSize());
      eventImage.setData(dto.picture().getBytes());
      return eventImage;
    } else {
      try {
        Resource resource = new ClassPathResource("static/default-event.jpg");
        byte[] imageBytes = FileCopyUtils.copyToByteArray(resource.getInputStream());
        EventImage eventImage = new EventImage();
        eventImage.setFilename("default-event");
        eventImage.setContentType("image/png");
        eventImage.setData(imageBytes);
        eventImage.setFileSize((long) imageBytes.length);
        return eventImage;
      } catch (IOException e) {
        throw new IOException("Could not load default event image" + e.getMessage());
      }
    }
  }

}
