package lt.techin.eventify.controller;

import jakarta.validation.Valid;
import lt.techin.eventify.dto.category.CategoryIconRequest;
import lt.techin.eventify.dto.category.CategoryIconResponse;
import lt.techin.eventify.dto.category.CategoryResponse;
import lt.techin.eventify.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/categories/all")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok().body(categoryService.getAllCategories());
    }

    @GetMapping("/categories/{id}/icon")
    public ResponseEntity<byte[]> getCategoryIcon(@PathVariable Long id) {
        CategoryIconResponse icon = categoryService.getCategoryIcon(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(icon.contentType()))
                .body(icon.data());
    }

    @PostMapping(value = "/categories/{id}/add-icon", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> addIconToCategory(@Valid @ModelAttribute CategoryIconRequest dto,
                                                  @PathVariable Long id) {
        try {
            categoryService.addIconToCategory(id,dto);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage());
        }
    }
}
