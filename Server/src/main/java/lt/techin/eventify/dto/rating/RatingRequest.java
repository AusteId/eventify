package lt.techin.eventify.dto.rating;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;

public record RatingRequest(

        @Min(value = 1, message = "Rating must be at least 1")
        @Max(value = 5, message = "Rating cannot be more than 5")
        int rating,

        @Positive(message = "Event ID must be a positive number")
        long eventId,

        @Positive(message = "Organizer ID must be a positive number")
        long organizerId
) {
}
