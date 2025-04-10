package lt.techin.eventify.dto.event;

import java.time.LocalDateTime;

public record EventSummaryResponse(
        long id,
        String name,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        String description,
        String city,
        Integer minAge,
        Integer maxAge,
        String experienceLevel,
        boolean isEnded,
        int currentParticipants,
        int maxParticipants
) {
}
