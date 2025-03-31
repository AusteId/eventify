package lt.techin.eventify.dto.registrationToEvent;

import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.UserImage;

import java.time.LocalDateTime;

public record RegistrationToEventResponse(
        long registrationId,
        UserJoinToEvent userJoinToEvent,
        JoinEventResponse joinEventResponse,
        LocalDateTime registeredAt
) {
}