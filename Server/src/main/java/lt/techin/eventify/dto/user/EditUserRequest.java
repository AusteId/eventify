package lt.techin.eventify.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lt.techin.eventify.model.Category;
import lt.techin.eventify.validation.file.ValidImage;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

public record EditUserRequest(
        @Size(max = 1000, message = "Description can be up to 1000 characters")
        String description,
        @ValidImage
        @Schema(type = "string", format = "binary")
        MultipartFile avatar,
        @Size(max = 20, message = "Can only have up to 20 interests")
        Set<Long> categoryIds
) {
}
