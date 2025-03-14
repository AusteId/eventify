package lt.techin.eventify.service;

import lt.techin.eventify.dto.event.UpdateEventRequest;
import lt.techin.eventify.exception.CategoryNotFoundException;
import lt.techin.eventify.exception.EventNotFoundException;
import lt.techin.eventify.exception.ForbiddenException;
import lt.techin.eventify.exception.UsernameNotFoundException;
import lt.techin.eventify.model.Category;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.CategoryRepository;
import lt.techin.eventify.repository.EventRepository;
import lt.techin.eventify.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

  private final EventRepository eventRepository;
  private final CategoryRepository categoryRepository;
  private final UserRepository userRepository;

  public EventService(EventRepository eventRepository, CategoryRepository categoryRepository, UserRepository userRepository) {
    this.eventRepository = eventRepository;
    this.categoryRepository = categoryRepository;
    this.userRepository = userRepository;
  }

  public Event saveEvent(Event event) {
    return eventRepository.save(event);
  }

  public List<Event> findAllEvents() {
    return eventRepository.findAll();
  }

  public Optional<Event> findEventById(Long id) {
    return eventRepository.findById(id);
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

}
