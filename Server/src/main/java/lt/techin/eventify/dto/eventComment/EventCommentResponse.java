package lt.techin.eventify.dto.eventComment;

import java.sql.Timestamp;

public record EventCommentResponse(
        long id,
        long userId,
        long eventId,
        String comment
) {
}
