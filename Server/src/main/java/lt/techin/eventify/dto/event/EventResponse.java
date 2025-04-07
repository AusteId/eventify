package lt.techin.eventify.dto.event;

import lt.techin.eventify.dto.category.CategoryResponse;
import lt.techin.eventify.dto.registrationToEvent.RegistrationToEventResponse;
import lt.techin.eventify.dto.registrationToEvent.UserRegisteredToEventResponse;
import lt.techin.eventify.dto.user.UserResponse;

import java.time.LocalDateTime;
import java.util.List;

public record EventResponse(
        long id,
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
        String photoPath,
        CategoryResponse category,
        UserResponse organizer,
        List<UserRegisteredToEventResponse> registrations,
        boolean isRegistered,
        Double latitude,
        Double longitude
) {
}
