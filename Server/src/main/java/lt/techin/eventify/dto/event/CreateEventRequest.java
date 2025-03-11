package lt.techin.eventify.dto.event;

import lt.techin.eventify.model.Category;
import lt.techin.eventify.model.User;

import java.time.LocalDateTime;
import java.util.Set;

public record CreateEventRequest(
        long id,
        Set<Category> category,
        User organizer,
        String name,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        LocalDateTime createdAt,
        String description,
        int minAge,
        int maxAge,
        String experienceLevel,
        int maxParticipants,
        String city,
        String address,
        String photoPath
) {
}
