package lt.techin.eventify.dto.registrationToEvent;

import lt.techin.eventify.model.RegistrationToEvent;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class RegistrationToEventMapper {
    public RegistrationToEvent toEventRegistration(RegistrationToEventRequest registrationToEventRequest) {
        return new RegistrationToEvent(
                registrationToEventRequest.user(),
                registrationToEventRequest.event(),
                LocalDateTime.now()
        );
    }

}
