package lt.techin.eventify.dto.ban;
import lt.techin.eventify.model.EventComment;
import org.springframework.stereotype.Component;


@Component
public class AdminMapper {


    public AdminCommentResponse commentToDTO(EventComment comment) {
        return new AdminCommentResponse(comment.getId(),
                comment.getUser().getId(),
                comment.getEvent().getId(),
                comment.getEvent().getName(),
                comment.getUser().getUsername(),
                comment.getComment(),
                comment.getCreatedAt());
    }
}
