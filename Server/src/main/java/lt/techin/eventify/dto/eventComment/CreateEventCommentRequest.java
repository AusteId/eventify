package lt.techin.eventify.dto.eventComment;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateEventCommentRequest(
        @NotNull(message = "Message cannot be null")
        @Size(max = 1000, message = "Message cannot exceed 1000 characters.")
        String comment
) {
}
