package lt.techin.eventify.dto.profileComment;

import lt.techin.eventify.model.ProfileComment;
import lt.techin.eventify.service.UserService;
import org.springframework.stereotype.Component;

@Component
public class ProfileCommentMapper {
    private final UserService userService;

    public ProfileCommentMapper(UserService userService) {
        this.userService = userService;
    }

    public ProfileCommentResponse toResponse (ProfileComment profileComment) {
        return new ProfileCommentResponse(profileComment.getId(), profileComment.getCommenter().getId(), profileComment.getCommented().getId(), profileComment.getComment(), profileComment.getCreatedAt());
    }

    public ProfileComment toProfileComment(CreateProfileCommentRequest dto) {
        return new ProfileComment(dto.commenter(), dto.commented(), dto.comment(), dto.createdAt());
    }

    public ProfileCommentResponse toProfileCommentResponse(ProfileComment comment) {
        return new ProfileCommentResponse(comment.getId(), comment.getCommenter().getId(), comment.getCommented().getId(), comment.getComment(), comment.getCreatedAt());
    }
}
