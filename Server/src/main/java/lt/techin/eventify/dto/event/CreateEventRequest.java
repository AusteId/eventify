package lt.techin.eventify.dto.event;

import jakarta.validation.constraints.*;
import lt.techin.eventify.model.Category;
import lt.techin.eventify.model.User;
import lt.techin.eventify.validation.event.ValidAgeRange;
import lt.techin.eventify.validation.event.ValidEventDates;

import java.time.LocalDateTime;

@ValidEventDates
@ValidAgeRange
public record CreateEventRequest(

        @NotNull(message = "Category cannot be null")
        Category category,

        @NotNull(message = "Organizer cannot be null")
        User organizer,

        @NotBlank(message = "Event name cannot be empty or null")
        @Size(min = 3, max = 100, message = "Event name must be between 3 and 100 characters")
        @Pattern(regexp = "^[A-Za-z0-9\\s'-]+$", message = "Event name can only contain letters and numbers")
        String name,

        @NotNull(message = "Start date and time cannot be null")
        @Future(message = "Start date and time must be in the future")
        LocalDateTime startDateTime,

        @Future(message = "End date and time must be in the future")
        LocalDateTime endDateTime,

        @Size(max = 1000, message = "Description must be less than 1000 characters.")
        String description,

        @Min(value = 0, message = "The age must be greater than zero")
        @Max(value = 120, message = "Minimum age cannot be more than 120")
        int minAge,

        @Min(value = 0, message = "The age must be greater than zer")
        @Max(value = 120, message = "Maximum age cannot be more than 120")
        int maxAge,

        @Pattern(regexp = "^(Beginner|Intermediate|Advanced|Extreme)?$", message = "Experience level must be Beginner, Intermediate, Advanced, Extreme")
        String experienceLevel,

        @NotNull(message = "Maximum number of participants cannot be null")
        @Min(value = 1, message = "Event must have at least 1 participant")
        @Max(value = 1000, message = "Event cannot have more than 1000 participants")
        int maxParticipants,

        @NotNull(message = "City cannot be null")
        @Size(max = 200, message = "City must be less than 200 characters.")
        @Pattern(regexp = "^([a-zA-Z\\u0080-\\u024F]+(?:. |-| |'))*[a-zA-Z\\u0080-\\u024F]*$", message = "Invalid event city name.")
        String city,

        @NotNull(message = "Address cannot be null")
        @Size(max = 255, message = "Address must be less than 255 characters.")
        @Pattern(regexp = "^[\\w\\s ,.]+$", message = "Invalid event address.")
        String address,

        // kol kas palikta nes nezinau kaip Tomo komponentas atrodys
        String photoPath
) {
}
