package lt.techin.eventify.dto.registrationToEvent;

import lt.techin.eventify.model.UserImage;

public record OrganizerResponse(
        long userId,
        String username

) {
}