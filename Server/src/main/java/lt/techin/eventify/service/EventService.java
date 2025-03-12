package lt.techin.eventify.service;

import lt.techin.eventify.model.Event;
import lt.techin.eventify.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

  EventRepository eventRepository;

  public EventService(EventRepository eventRepository) {
    this.eventRepository = eventRepository;
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
}
