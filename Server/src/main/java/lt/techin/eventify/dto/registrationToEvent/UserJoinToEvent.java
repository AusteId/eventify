package lt.techin.eventify.dto.registrationToEvent;

import lt.techin.eventify.model.UserImage;

public record UserJoinToEvent(
        long userId,
        String userName
) {
}
