package lt.techin.eventify.service;

import lt.techin.eventify.dto.event.EventMapper;
import lt.techin.eventify.dto.event.EventResponse;
import lt.techin.eventify.dto.event.UpdateEventRequest;
import lt.techin.eventify.exception.CategoryNotFoundException;
import lt.techin.eventify.exception.EventNotFoundException;
import lt.techin.eventify.exception.ForbiddenException;
import lt.techin.eventify.exception.UsernameNotFoundException;
import lt.techin.eventify.model.Category;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.mysql.CategoryRepository;
import lt.techin.eventify.repository.mysql.EventRepository;
import lt.techin.eventify.repository.mysql.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
public class EventService {

  private final EventRepository eventRepository;
  private final CategoryRepository categoryRepository;
  private final UserRepository userRepository;
  private final EventMapper eventMapper;

  public EventService(EventRepository eventRepository, CategoryRepository categoryRepository,
                      UserRepository userRepository, EventMapper eventMapper) {
    this.eventRepository = eventRepository;
    this.categoryRepository = categoryRepository;
    this.userRepository = userRepository;
    this.eventMapper = eventMapper;
  }

  public Event saveEvent(Event event) {
    return eventRepository.save(event);
  }

  public Event updateEvent(long eventId, UpdateEventRequest updateEventRequest) {

    Event event = eventRepository.findById(eventId).orElseThrow(() ->
            new EventNotFoundException("Event with ID " + eventId + " not found"));

    Category category = categoryRepository.findByName(updateEventRequest.categoryName()).orElseThrow(() ->
            new CategoryNotFoundException("Category '" + updateEventRequest.categoryName() + "' not found"));

    event.setCategory(category);
    event.setName(updateEventRequest.name());
    event.setStartDateTime(updateEventRequest.startDateTime());
    event.setEndDateTime(updateEventRequest.endDateTime());
    event.setDescription(updateEventRequest.description());
    event.setMinAge(updateEventRequest.minAge());
    event.setMaxAge(updateEventRequest.maxAge());
    event.setExperienceLevel(updateEventRequest.experienceLevel());
    event.setMaxParticipants(updateEventRequest.maxParticipants());
    event.setCity(updateEventRequest.city());
    event.setAddress(updateEventRequest.address());
    event.setPhotoPath(updateEventRequest.photoPath());

    return eventRepository.save(event);
  }

  public void deleteEvent(long eventId, Principal principal) {

    Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new EventNotFoundException("Event with ID " + eventId + " not found"));

    User currentUser = userRepository.findByUsername(principal.getName())
            .orElseThrow(() -> new UsernameNotFoundException("User " + principal.getName() + " not found"));

    boolean isAdmin = currentUser.getRoles()
            .stream()
            .anyMatch(role -> role.getName().equalsIgnoreCase("ADMIN"));

    boolean isEventOwner = event.getOrganizer() != null && event.getOrganizer().getUsername().equals(currentUser.getUsername());

    if (isAdmin || isEventOwner) {
      eventRepository.delete(event);
    } else {
      throw new ForbiddenException("You do not have permission to delete this event");
    }

  }

  public List<EventResponse> getUserEvents(long userId) {

    User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User " + userId + " not found"));

    List<Event> events = eventRepository.findByOrganizer(user);

    return events.stream()
            .map(eventMapper::toEventResponse)
            .toList();
  }

  public List<EventResponse> getAllEvents() {
    return eventRepository.findAll().stream()
            .map(eventMapper::toEventResponse)
            .toList();
  }

  public Page<EventResponse> findEventsByFilters(String categoryName, String city, String startDateTime,
                                                 String endDateTime, String experienceLevel,
                                                 Integer minAge, Integer maxAge, String searchTerm, Pageable pageable) {

    if (categoryName != null && !categoryName.isEmpty()) {
      categoryRepository.findByName(categoryName)
              .orElseThrow(() -> new CategoryNotFoundException("Category '" + categoryName + "' not found"));
    }

    Page<Event> eventPage = eventRepository.findEventsByFilters(categoryName, city, startDateTime, endDateTime,
            experienceLevel, minAge, maxAge, searchTerm, pageable);

    List<EventResponse> eventResponses = eventPage.getContent().stream()
            .map(eventMapper::toEventResponse)
            .toList();

    return new PageImpl<>(eventResponses, pageable, eventPage.getTotalElements());
  }

  public Event findById(long id) {
    return eventRepository.findById(id).orElse(null);
  }
}
