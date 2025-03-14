package lt.techin.eventify.dto.user;

import jakarta.validation.constraints.*;
import lt.techin.eventify.validation.file.ValidImage;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public record CreateUserRequest(
        @NotNull(message = "Username cannot be null")
        @NotBlank(message = "Username cannot be empty or consist only of spaces")
        @Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters")
        @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Username can only contain letters and numbers")
        String username,

        @NotNull(message = "Email cannot be null")
        @NotBlank(message = "Email cannot be empty or consist only of spaces")
        @Pattern(regexp = "^(?=.{3,254}$)(?=.{1,64}@)(?!\\.)(?!.*\\.\\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]{1,253}\\.[A-Za-z]{2,}$",
                message = "Invalid email format. It must be in the format 'user@example.com'")
        String email,

        @NotNull(message = "Password cannot be null")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_])[\\S]{8,255}$",
                message = "Password must contain at least one lowercase letter, one uppercase letter, " +
                        "one number, one special character, and be 8-255 characters long"
        )
        String password,
        @Size(max = 255, message = "City can be up to 255 characters")
        String city,
        @Size(max = 1000, message = "Description can be up to 1000 characters")
        String description,
        @Past(message = "Birthdate must be in the past")
        LocalDate birthDate,
        @Size(max = 20, message = "Can only have up to 20 interests")
        List<Long> categoryIds,
        @ValidImage
        MultipartFile avatar
) {
}
