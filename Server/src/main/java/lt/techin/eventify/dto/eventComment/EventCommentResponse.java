package lt.techin.eventify.dto.eventComment;

import lt.techin.eventify.dto.user.UserResponse;

import java.sql.Time;
import java.sql.Timestamp;

public record EventCommentResponse(
        long id,
        UserResponse userResponse,
        long eventId,
        String comment,
        String createdAt
) {
}
