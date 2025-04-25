package lt.techin.eventify.dto.ban;

import lt.techin.eventify.dto.user.UserResponse;

import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDateTime;

public record AdminCommentResponse(
        Long commentId,
        Long userId,
        Long eventId,
        String eventName,
        String username,
        String comment,
        LocalDateTime createdAt
) {
}