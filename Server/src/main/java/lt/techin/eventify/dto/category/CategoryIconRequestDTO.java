package lt.techin.eventify.dto.category;

import lt.techin.eventify.validation.ValidImage;
import org.springframework.web.multipart.MultipartFile;

public record CategoryIconRequestDTO (
        @ValidImage
        MultipartFile categoryIcon
){
}
