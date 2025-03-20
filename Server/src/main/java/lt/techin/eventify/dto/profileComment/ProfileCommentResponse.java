package lt.techin.eventify.dto.profileComment;

import java.sql.Timestamp;

public record ProfileCommentResponse(
        long id,
        long commenterId,
        long commentedId,
        String comment,
        Timestamp createdAt
) {
}
