package lt.techin.eventify.dto.user;

public record CreateUserRequest(

        String username,
        String email,
        String password
) {
}
