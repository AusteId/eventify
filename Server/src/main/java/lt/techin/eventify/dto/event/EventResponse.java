package lt.techin.eventify.dto.event;

import lt.techin.eventify.dto.category.CategoryResponse;
import lt.techin.eventify.dto.user.UserResponse;

import java.time.LocalDateTime;

public record EventResponse(
        long id,
        CategoryResponse category,
        UserResponse organizer,
        String name,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        LocalDateTime createdAt,
        String description,
        Integer minAge,
        Integer maxAge,
        String experienceLevel,
        int maxParticipants,
        String city,
        String address,
        String photoPath
) {
}
