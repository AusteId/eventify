package lt.techin.eventify.dto.registrationToEvent;

import java.time.LocalDateTime;

public record RegistrationToEventResponse(
        long registrationId,
        UserJoinToEvent userJoinToEvent,
        JoinEventResponse joinEventResponse,
        LocalDateTime registeredAt
) {
}