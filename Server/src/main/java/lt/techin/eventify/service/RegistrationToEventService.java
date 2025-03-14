package lt.techin.eventify.service;

import lt.techin.eventify.model.RegistrationToEvent;
import lt.techin.eventify.repository.RegistrationToEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RegistrationToEventService {
  private final RegistrationToEventRepository registrationToEventRepository;

  @Autowired
  public RegistrationToEventService(RegistrationToEventRepository registrationToEventRepository) {
    this.registrationToEventRepository = registrationToEventRepository;
  }

  public RegistrationToEvent saveEventRegistration(RegistrationToEvent registrationToEvent) {
    return registrationToEventRepository.save(registrationToEvent);
  }

  public int countRegistrationsByEvent(Long eventId) {
    return registrationToEventRepository.countByEventId(eventId);
  }

}
