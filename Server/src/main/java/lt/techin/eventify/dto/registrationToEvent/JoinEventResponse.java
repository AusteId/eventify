package lt.techin.eventify.dto.registrationToEvent;

import lt.techin.eventify.model.Category;

import java.time.LocalDateTime;

public record JoinEventResponse(
        Category category,
        OrganizerResponse organizerResponse,
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

