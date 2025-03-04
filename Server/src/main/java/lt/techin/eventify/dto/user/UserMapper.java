package lt.techin.eventify.dto.user;

import lt.techin.eventify.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getCity(),
                user.getBirthDate(),
                user.getDescription(),
                user.getFavoriteEventCategories(),
                user.getPhotoPath());
    }

    public User toUser(CreateUserRequest dto) {
        User user = new User();
        user.setUsername(dto.username());
        user.setEmail(dto.email());
        user.setPassword(dto.password());
        return user;
    }
}
