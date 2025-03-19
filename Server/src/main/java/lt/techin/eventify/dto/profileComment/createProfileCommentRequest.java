package lt.techin.eventify.dto.profileComment;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lt.techin.eventify.model.User;

import java.sql.Timestamp;

public record createProfileCommentRequest(
        @NotNull(message =  "Commenter cannot be null")
        User commenterId,

        @NotNull(message =  "Commented cannot be null")
        User commented,

        @NotNull(message =  "Message cannot be null")
        @Size(max = 1000, message = "Message cannot exceed 1000 characters.")
        String comment,

        @NotNull(message =  "Created time cannot be null")
        Timestamp createdAt
) {

}
