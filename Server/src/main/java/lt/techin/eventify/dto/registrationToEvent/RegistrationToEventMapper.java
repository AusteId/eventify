package lt.techin.eventify.dto.registrationToEvent;

import lt.techin.eventify.model.RegistrationToEvent;
import org.springframework.stereotype.Component;

@Component
public class RegistrationToEventMapper {
  public RegistrationToEvent toEventRegistration(RegistrationToEventRequest registrationToEventRequest) {
    return new RegistrationToEvent(

    );
  }

}
