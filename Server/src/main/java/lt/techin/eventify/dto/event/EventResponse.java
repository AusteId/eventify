package lt.techin.eventify.dto.event;

import lt.techin.eventify.dto.category.CategoryResponseDTO;
import lt.techin.eventify.dto.user.UserResponse;
import lt.techin.eventify.model.Category;
import lt.techin.eventify.model.User;

import java.time.LocalDateTime;
import java.util.Set;

public record EventResponse(
        long id,
        CategoryResponseDTO category,
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
