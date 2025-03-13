package lt.techin.eventify.dto.event;

import jakarta.validation.constraints.*;
import lt.techin.eventify.model.Category;
import lt.techin.eventify.model.User;

import java.time.LocalDateTime;

public record CreateEventRequest(

        Category category,

        @NotNull
        User organizer,

        @NotBlank(message = "Event name cannot be empty or null")
        @Size(min = 3, max = 100, message = "Event name must be between 3 and 100 characters")
        @Pattern(regexp = "^[A-Za-z0-9\\s'-]+$", message = "Event name can only contain letters and numbers")
        String name,
        @NotNull
        @Future
        LocalDateTime startDateTime,
        @Future
        LocalDateTime endDateTime,

        @Size(max = 1000, message = "Description must be less than 1000 characters.")
        String description,
        @Positive
        int minAge,
        @Positive
        int maxAge,
        String experienceLevel,

        @NotNull
        @Positive
        int maxParticipants,
        @NotNull
        @Pattern(regexp = "^([a-zA-Z\\u0080-\\u024F]+(?:. |-| |'))*[a-zA-Z\\u0080-\\u024F]*$", message = "Invalid event city name.")
        String city,

        @NotNull
        @Pattern(regexp = "^[\\w\\s ,.]+$", message = "Invalid event address.")
        String address,

        // kol kas palikta nes nezinau kaip Tomo komponentas atrodys
        String photoPath
) {
}
