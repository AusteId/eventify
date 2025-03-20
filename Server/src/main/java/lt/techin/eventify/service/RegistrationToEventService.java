package lt.techin.eventify.service;

import lt.techin.eventify.dto.event.EventResponse;
import lt.techin.eventify.exception.AlreadyExistsException;
import lt.techin.eventify.exception.EventFullException;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.RegistrationToEvent;
import lt.techin.eventify.repository.RegistrationToEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RegistrationToEventService {
  private final RegistrationToEventRepository registrationToEventRepository;
  private final EventService eventService;

  @Autowired
  public RegistrationToEventService(RegistrationToEventRepository registrationToEventRepository, EventService eventService) {
    this.registrationToEventRepository = registrationToEventRepository;
    this.eventService = eventService;
  }

  public RegistrationToEvent saveEventRegistration(RegistrationToEvent registrationToEvent) {

    Long eventId = registrationToEvent.getEvent().getId();
    Long userId = registrationToEvent.getUser().getId();

    if (registrationToEventRepository.existsByUserIdAndEventId(userId, eventId)) {
      throw new AlreadyExistsException("User is already registered for this event");
    }

    EventResponse event = eventService.getEventById(eventId);

    int registrationCount = countRegistrationsByEventId(eventId);
    if (registrationCount >= event.maxParticipants()){
      throw new EventFullException("No slots available for this event");
    }



    return registrationToEventRepository.save(registrationToEvent);
  }

  public int countRegistrationsByEventId(Long eventId) {
    return registrationToEventRepository.countByEventId(eventId);
  }



}
