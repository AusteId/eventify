package lt.techin.eventify.dto.category;

import lt.techin.eventify.validation.file.ValidImage;
import org.springframework.web.multipart.MultipartFile;

public record CategoryIconRequest(
        @ValidImage
        MultipartFile categoryIcon
) {
}
