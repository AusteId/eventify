package lt.techin.eventify.dto.profileComment;

public record ProfileCommentResponse(
        long id,
        long commenterId,
        long commentedId,
        String comment
) {
}
