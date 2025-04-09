package lt.techin.eventify.dto.event;

import java.time.LocalDateTime;

public record EventMapResponse(
        long id,
        String name,
        String city,
        String address,
        Double latitude,
        Double longitude,
        LocalDateTime startDateTime
) {
}
