package lt.techin.eventify.dto.registrationToEvent;

public record UserJoinToEvent(
        long userId,
        String userName
) {
}
