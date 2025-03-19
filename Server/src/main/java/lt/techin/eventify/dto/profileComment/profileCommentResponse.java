package lt.techin.eventify.dto.profileComment;

import lt.techin.eventify.model.User;

import java.sql.Timestamp;

public record profileCommentResponse(
        long id,
        long commenterId,
        long commentedId,
        String comment,
        Timestamp createdAt
) {
}
