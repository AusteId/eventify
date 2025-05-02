package lt.techin.eventify.dto.profileComment;

import lt.techin.eventify.dto.user.UserResponse;

public record ProfileCommentResponse(
        long id,
        UserResponse userResponse,
        long commenterId,
        long commentedId,
        String comment,
        String createdAt
) {
}
