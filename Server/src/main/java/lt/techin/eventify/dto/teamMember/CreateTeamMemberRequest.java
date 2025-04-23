package lt.techin.eventify.dto.teamMember;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lt.techin.eventify.validation.file.ValidImage;
import org.springframework.web.multipart.MultipartFile;

public record CreateTeamMemberRequest(

        @NotBlank(message = "Name cannot be empty or null")
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
        @Pattern(regexp = "^[A-Za-zÀ-ž\\s'-]+$", message = "Name can only contain letters, spaces, apostrophes, and hyphens")
        String name,

        @NotBlank(message = "LinkedIn URL cannot be empty")
        @Pattern(regexp = "^(https?://)?(www\\.)?(linkedin\\.com|soundcloud\\.com)/.*$", message = "Invalid LinkedIn " +
                "URL")
        String linkedin,

        @NotBlank(message = "GitHub URL cannot be empty")
        @Pattern(regexp = "^(https?://)?(www\\.)?(github\\.com|soundcloud\\.com)/.*$", message = "Invalid GitHub URL")
        String github,

        @NotBlank(message = "Email cannot be empty")
        String email,

        @ValidImage
        @Schema(type = "string",format = "binary")
        MultipartFile profile

) {
}
