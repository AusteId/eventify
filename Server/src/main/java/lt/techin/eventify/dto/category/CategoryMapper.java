package lt.techin.eventify.dto.category;

import lt.techin.eventify.model.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

  public static CategoryResponseDTO toDTO(Category category) {
    return new CategoryResponseDTO(category.getId(), category.getName());
  }
}
