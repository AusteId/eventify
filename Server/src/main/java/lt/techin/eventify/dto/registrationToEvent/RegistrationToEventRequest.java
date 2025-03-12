package lt.techin.eventify.dto.registrationToEvent;

import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.User;

public record RegistrationToEventRequest(
        User user,
        Event event
) {
}
