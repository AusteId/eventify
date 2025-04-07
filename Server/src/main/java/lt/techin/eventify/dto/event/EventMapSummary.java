package lt.techin.eventify.dto.event;

import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;

public record EventMapSummary(
        long id,
        String name,
        String city,
        String address,
        Point location,
        LocalDateTime startDateTime
) {
}
