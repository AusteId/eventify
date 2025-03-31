package lt.techin.eventify.dto.registrationToEvent;

import java.time.LocalDateTime;

public record UserRegisteredToEventResponse(
        long registrationId,
        UserJoinToEvent userJoinToEvent,
        LocalDateTime registeredAt
) {
}
