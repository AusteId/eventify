package lt.techin.eventify.dto.eventComment;

public record EventCommentResponse(
        long id,
        long userId,
        long eventId,
        String comment
) {
}
