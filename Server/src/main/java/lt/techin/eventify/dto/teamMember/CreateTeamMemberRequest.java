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
        @Pattern(regexp = "^(https?://)?(www\\.)?linkedin\\.com/.*$", message = "Invalid LinkedIn URL")
        String linkedin,

        @NotBlank(message = "GitHub URL cannot be empty")
        @Pattern(regexp = "^(https?://)?(www\\.)?github\\.com/.*$", message = "Invalid GitHub URL")
        String github,

        @NotBlank(message = "Phone number cannot be empty")
        @Pattern(regexp = "^\\+?[0-9\\s\\-()]{7,20}$", message = "Invalid phone number")
        String phoneNumber,

        @NotBlank(message = "Email cannot be empty")
        @Email(message = "Invalid email address")
        String email,

        String imageUrl, // Optional if image is uploaded

        @ValidImage
        @Schema(type = "string", format = "binary")
        MultipartFile picture
) {
}
