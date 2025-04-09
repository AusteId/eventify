package lt.techin.eventify.service;

import lt.techin.eventify.dto.event.EventMapper;
import lt.techin.eventify.exception.*;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.RegistrationToEvent;
import lt.techin.eventify.repository.mysql.RegistrationToEventRepository;
import lt.techin.eventify.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RegistrationToEventService {
  private final RegistrationToEventRepository registrationToEventRepository;
  private final EventService eventService;
  private final UserService userService;
  private final EventMapper eventMapper;

  @Autowired
  public RegistrationToEventService(RegistrationToEventRepository registrationToEventRepository, EventService eventService, UserService userService, EventMapper eventMapper) {
    this.registrationToEventRepository = registrationToEventRepository;
    this.eventService = eventService;
    this.userService = userService;
    this.eventMapper = eventMapper;
  }

  public RegistrationToEvent saveEventRegistration(RegistrationToEvent registrationToEvent) {
    return registrationToEventRepository.save(registrationToEvent);
  }

  public int countRegistrationsByEventId(Long eventId) {
    return registrationToEventRepository.countByEventId(eventId);
  }

  public RegistrationToEvent saveEventRegistration(Long eventId, String username) {

    User user = userService.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User " + username + " not found"));

    Event event = eventService.findEventById(eventId);

    if (user.getId().equals(event.getOrganizer().getId())) {
      throw new OrganizaeCannotRegisterException("An organizer cannot register for their own event.");
    }

    if (registrationToEventRepository.existsByUserIdAndEventId(user.getId(), eventId)) {
      throw new AlreadyRegisterException("User is already registered for this event");
    }

    int registrationCount = countRegistrationsByEventId(eventId);
    if (registrationCount >= event.getMaxParticipants()) {
      throw new EventFullException("No slots available for this event");
    }

    RegistrationToEvent registration = new RegistrationToEvent(user, event, LocalDateTime.now());
    return registrationToEventRepository.save(registration);
  }

  public void cancelEventRegistration(Long eventId, String username) {

    User user = userService.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User " + username + " not found"));


    Event event = eventService.findEventById(eventId);

//        if (LocalDateTime.now().isAfter(event.getStartDateTime())) {
//            throw new RuntimeException("Cannot cancel registration after the event has started");
//        }


    RegistrationToEvent registration = registrationToEventRepository
            .findByUserIdAndEventId(user.getId(), eventId)
            .orElseThrow(() -> new RuntimeException("Registration not found for this user and event"));


    registrationToEventRepository.delete(registration);
  }

    public int countRegistrationsByEventIdAndUserId(Long eventId, Long userId) {
        return registrationToEventRepository.countByEventIdAndUserId(eventId, userId);
    }


}
