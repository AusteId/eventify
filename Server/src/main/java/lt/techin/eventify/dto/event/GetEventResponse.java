package lt.techin.eventify.dto.event;

import java.time.LocalDateTime;

public record GetEventResponse(
        long id,
        String name,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        String description,
        Integer minAge,
        Integer maxAge,
        String experienceLevel,
        int maxParticipants,
        String city,
        String address
) {
}
