package lt.techin.eventify.validation.file;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lt.techin.eventify.controller.EventController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class ImageFileValidator implements ConstraintValidator<ValidImage, MultipartFile> {
  private static final long MAX_SIZE = 8 * 1024 * 1024;
  private static final Logger logger = LoggerFactory.getLogger(ImageFileValidator.class);
  private static final List<String> VALID_CONTENT_TYPES = List.of(
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/jpg",
          "image/avif"
  );

  @Override
  public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {
    if (file == null || file.isEmpty()) {
      return true;
    }

    if (file.getSize() > MAX_SIZE) {
      context.disableDefaultConstraintViolation();
      context.buildConstraintViolationWithTemplate("File size cannot exceed 8mb")
              .addConstraintViolation();
      return false;
    }

    if (!VALID_CONTENT_TYPES.contains(file.getContentType())) {
      context.disableDefaultConstraintViolation();
      context.buildConstraintViolationWithTemplate("Supports only JPEG,PNG,JPG,GIF,AVIF")
              .addConstraintViolation();
      return false;
    }
    return true;
  }
}
