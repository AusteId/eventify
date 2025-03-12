package lt.techin.eventify.service;

import lt.techin.eventify.dto.event.UpdateEventRequest;
import lt.techin.eventify.exception.CategoryNotFoundException;
import lt.techin.eventify.exception.EventNotFoundException;
import lt.techin.eventify.model.Category;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.repository.CategoryRepository;
import lt.techin.eventify.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class EventService {

  private final EventRepository eventRepository;
  private final CategoryRepository categoryRepository;

  public EventService(EventRepository eventRepository, CategoryRepository categoryRepository) {
    this.eventRepository = eventRepository;
    this.categoryRepository = categoryRepository;
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
}
