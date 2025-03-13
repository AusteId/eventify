package lt.techin.eventify.dto.category;

import lt.techin.eventify.model.Category;

public class CategoryMapper {

    public static CategoryResponseDTO toDTO(Category category) {
        return new CategoryResponseDTO(category.getId(), category.getName());
    }
}
