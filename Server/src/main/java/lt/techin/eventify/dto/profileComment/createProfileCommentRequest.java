package lt.techin.eventify.dto.profileComment;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.sql.Timestamp;

public record createProfileCommentRequest(
        @NotNull(message =  "Commenter cannot be null")
        long commenterId,

        @NotNull(message =  "Commented cannot be null")
        long commentedId,

        @NotNull(message =  "Message cannot be null")
        @Size(max = 1000, message = "Message cannot exceed 1000 characters.")
        String comment,

        @NotNull(message =  "Created time cannot be null")
        Timestamp createdAt
) {

}
