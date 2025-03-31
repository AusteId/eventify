package lt.techin.eventify.dto.profileComment;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateProfileCommentRequest(
        @NotNull(message = "Message cannot be null")
        @Size(max = 1000, message = "Message cannot exceed 1000 characters.")
        String comment
) {

}
