package lt.techin.eventify.dto.teamMember;
import jakarta.validation.constraints.*;

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

        @NotBlank(message = "Email cannot be empty")
        @Email(message = "Invalid email address")
        String email,

        String imageUrl

) {
}
