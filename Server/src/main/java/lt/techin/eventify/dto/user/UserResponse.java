package lt.techin.eventify.dto.user;

import lt.techin.eventify.model.Category;
import lt.techin.eventify.model.Role;

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
        Set<Role> roles,
        Double averageRating,
        Integer ratingCount
) {
}
