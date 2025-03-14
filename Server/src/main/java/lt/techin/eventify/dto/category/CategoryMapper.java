package lt.techin.eventify.dto.category;

import lt.techin.eventify.model.Category;
import org.springframework.stereotype.Component;
import lt.techin.eventify.model.CategoryIcon;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;

@Component
public class CategoryMapper {

    public static CategoryResponse toDTO(Category category) {
        return new CategoryResponse(category.getId(), category.getName());
    }

    public static CategoryIcon iconToEntity(CategoryIconRequest dto) throws IOException {
        if (dto.categoryIcon() != null && !dto.categoryIcon().isEmpty()) {
            CategoryIcon icon = new CategoryIcon();
            icon.setFilename(dto.categoryIcon().getOriginalFilename());
            icon.setContentType(dto.categoryIcon().getContentType());
            icon.setFileSize(dto.categoryIcon().getSize());
            icon.setData(dto.categoryIcon().getBytes());
            return icon;
        } else {
            try {
                Resource resource = new ClassPathResource("static/default-category-icon.png");
                byte[] iconBytes = FileCopyUtils.copyToByteArray(resource.getInputStream());
                CategoryIcon icon = new CategoryIcon();
                icon.setFilename("default-category-icon");
                icon.setContentType("image/png");
                icon.setData(iconBytes);
                icon.setFileSize((long)iconBytes.length);
                return icon;
            } catch (IOException e) {
                throw new IOException("Could not load default category icon" + e.getMessage());
            }
        }
    }
}
