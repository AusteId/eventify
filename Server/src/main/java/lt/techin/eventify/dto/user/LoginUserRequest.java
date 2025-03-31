package lt.techin.eventify.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record LoginUserRequest(
        @NotNull(message = "Email cannot be null")
        @NotBlank(message = "Email cannot be empty or consist only of spaces")
        @Pattern(regexp = "^(?=.{3,254}$)(?=.{1,64}@)(?!\\.)(?!.*\\.\\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]{1,253}\\.[A-Za-z]{2,}$",
                message = "Invalid email format. It must be in the format 'user@example.com'")
        String email,

        @NotNull(message = "Password cannot be null")
        @NotBlank(message = "Password cannot be empty or consist only of spaces")
        @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters")
//        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]+$",
//                message = "Password must contain at least one uppercase letter, one lowercase letter, and one number")
        String password
) {
}
