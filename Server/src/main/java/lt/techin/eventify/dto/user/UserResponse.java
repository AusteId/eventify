package lt.techin.eventify.dto.user;

import lt.techin.eventify.model.Category;

import java.time.LocalDate;
import java.util.Set;

public record UserResponse(
        long id,
        String username,
        String email,
        String city,
        LocalDate birthDate,
        String description,
        Set<Category> favoriteEventCategories,
        String photoPath
) {
}
