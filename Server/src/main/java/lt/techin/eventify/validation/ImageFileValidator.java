package lt.techin.eventify.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class ImageFileValidator implements ConstraintValidator<ValidImage, MultipartFile> {
    private static final long MAX_SIZE = 5 * 1024 * 1024;
    private static final List<String> VALID_CONTENT_TYPES = List.of(
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/jpg"
    );

    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {
        if (file == null || file.isEmpty()) {
            return true;
        }

        if (file.getSize() > MAX_SIZE) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("File size cannot exceed 5mb")
                    .addConstraintViolation();
            return false;
        }
        if (!VALID_CONTENT_TYPES.contains(file.getContentType())) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Supports only JPEG,PNG,JPG,GIF is allowed")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}
