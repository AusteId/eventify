package lt.techin.eventify.dto.event;

import lombok.AllArgsConstructor;
import lt.techin.eventify.dto.category.CategoryMapper;
import lt.techin.eventify.dto.user.CreateUserRequest;
import lt.techin.eventify.dto.registrationToEvent.RegistrationToEventMapper;
import lt.techin.eventify.dto.registrationToEvent.RegistrationToEventResponse;
import lt.techin.eventify.dto.user.UserMapper;
import lt.techin.eventify.exception.CategoryNotFoundException;
import lt.techin.eventify.exception.UserNotFoundException;
import lt.techin.eventify.model.*;
import lt.techin.eventify.repository.mysql.CategoryRepository;
import lt.techin.eventify.repository.mysql.UserRepository;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.User;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.time.LocalDateTime;
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

  public EventResponse toEventResponse(Event event) {

    List<RegistrationToEventResponse> registrations = event.getRegistrations().stream()
            .map(registrationToEventMapper::toEventRegistrationResponse)
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
            registrations
    );
  }

  public Event toEvent(CreateEventRequest createEventRequest) {
    Category category = categoryRepository.findById(createEventRequest.categoryId()).orElseThrow(() -> new CategoryNotFoundException("category not found for id " + createEventRequest.categoryId()));
    User organizer = userRepository.findById(createEventRequest.organizerId()).orElseThrow(() -> new UserNotFoundException("user not found for id " + createEventRequest.organizerId()));

    return new Event(
            category,
            organizer,
            createEventRequest.name(),
            createEventRequest.startDateTime(),
            createEventRequest.endDateTime(),
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
