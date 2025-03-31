package lt.techin.eventify.dto.event;

import jakarta.validation.constraints.*;
import lt.techin.eventify.validation.file.ValidImage;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

public record UpdateEventRequest(

        String photoPath,

        @NotBlank(message = "Event name cannot be empty or null")
        @Size(min = 3, max = 100, message = "Event name must be between 3 and 100 characters")
        @Pattern(regexp = "^[A-Za-z0-9\\s'-]+$", message = "Event name can only contain letters and numbers")
        String name,

        @NotNull
        @Pattern(regexp = "^([a-zA-Z\\u0080-\\u024F]+(?:. |-| |'))*[a-zA-Z\\u0080-\\u024F]*$", message = "Invalid event city name.")
        String city,

        @NotNull
        @Future
        LocalDateTime startDateTime,

        @Future
        LocalDateTime endDateTime,

        @NotNull(message = "Category cannot be null")
        String categoryName,

        @Size(max = 1000, message = "Description must be less than 1000 characters.")
        String description,

        @Positive
        Integer minAge,

        @Positive
        Integer maxAge,

        String experienceLevel,

        @NotNull
        @Positive
        int maxParticipants,

        @NotNull
        @Pattern(regexp = "^[\\w\\s ,.]+$", message = "Invalid event address.")
        String address,

        @ValidImage
        MultipartFile picture
) {
}
