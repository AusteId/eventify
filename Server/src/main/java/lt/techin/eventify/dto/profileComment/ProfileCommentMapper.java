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

    public profileCommentResponse toResponse (ProfileComment profileComment) {
        return new profileCommentResponse(profileComment.getId(), profileComment.getCommenter().getId(), profileComment.getCommented().getId(), profileComment.getComment(), profileComment.getCreatedAt());
    }

    public ProfileComment toProfileComment(createProfileCommentRequest dto) {
        ProfileComment comment = new ProfileComment();

        comment.setCommenter(userService.findById(dto.commenterId()));
        comment.setCommented(userService.findById(dto.commentedId()));
        comment.setComment(dto.comment());
        comment.setCreatedAt(dto.createdAt());

        return comment;
    }

    public profileCommentResponse toProfileCommentResponse(ProfileComment comment) {
        return new profileCommentResponse(comment.getId(), comment.getCommenter().getId(), comment.getCommented().getId(), comment.getComment(), comment.getCreatedAt());
    }
}
