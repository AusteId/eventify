package lt.techin.eventify.service;


import lt.techin.eventify.dto.category.CategoryMapper;
import lt.techin.eventify.dto.category.CategoryResponseDTO;
import lt.techin.eventify.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryResponseDTO> getAllCategories() {
        return categoryRepository.findAll().stream().map(CategoryMapper::toDTO).toList();
    }
}
