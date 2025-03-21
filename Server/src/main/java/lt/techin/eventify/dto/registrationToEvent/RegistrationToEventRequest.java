package lt.techin.eventify.dto.registrationToEvent;

import lt.techin.eventify.dto.event.EventResponse;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.User;

import java.time.LocalDateTime;

public record RegistrationToEventRequest(
        long id,
        User user,
        Event event,
        LocalDateTime registeredAt
) {

}
