package lt.techin.eventify.service;


import lt.techin.eventify.dto.category.CategoryIconRequest;
import lt.techin.eventify.dto.category.CategoryIconResponse;
import lt.techin.eventify.dto.category.CategoryMapper;
import lt.techin.eventify.dto.category.CategoryResponse;
import lt.techin.eventify.exception.NotFoundException;
import lt.techin.eventify.model.Category;
import lt.techin.eventify.model.CategoryIcon;
import lt.techin.eventify.repository.CategoryIconRepository;
import lt.techin.eventify.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class CategoryService {
  private final CategoryRepository categoryRepository;
  private final CategoryIconRepository categoryIconRepository;

  public CategoryService(CategoryRepository categoryRepository, CategoryIconRepository categoryIconRepository) {
    this.categoryRepository = categoryRepository;
    this.categoryIconRepository = categoryIconRepository;
  }

  private Category checkCategory(Long categoryId) {
    return categoryRepository.findById(categoryId).orElseThrow(() -> new NotFoundException("Category" +
            " with id '" + categoryId + "' was not found"));
  }

  public List<CategoryResponse> getAllCategories() {
    return categoryRepository.findAll().stream().map(CategoryMapper::toDTO).toList();
  }


  // Icon related Section
  public CategoryIconResponse getCategoryIcon(Long categoryId) {
    Category category = checkCategory(categoryId);
    if (category.getIcon() == null || category.getIcon().getData() == null) {
      throw new NotFoundException("Icon for the category not found");
    }
    return new CategoryIconResponse(
            category.getIcon().getData(),
            category.getIcon().getContentType());

  }

  public void addIconToCategory(Long categoryId, CategoryIconRequest dto) throws IOException {
    Category category = checkCategory(categoryId);
    if (category.getIcon() != null) {
      CategoryIcon existingIcon = category.getIcon();
      existingIcon.setFilename(dto.categoryIcon().getOriginalFilename());
      existingIcon.setContentType(dto.categoryIcon().getContentType());
      existingIcon.setData(dto.categoryIcon().getBytes());
      existingIcon.setFileSize(dto.categoryIcon().getSize());
      category.setIcon(existingIcon);
    } else {
      CategoryIcon icon = CategoryMapper.iconToEntity(dto);
      category.setIcon(icon);
    }
    categoryRepository.save(category);
  }

}
