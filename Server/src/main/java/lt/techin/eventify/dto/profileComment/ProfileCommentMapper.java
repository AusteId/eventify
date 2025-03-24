package lt.techin.eventify.dto.profileComment;

import lt.techin.eventify.model.ProfileComment;
import lt.techin.eventify.model.User;
import lt.techin.eventify.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class ProfileCommentMapper {
    private final UserService userService;

    public ProfileCommentMapper(UserService userService) {
        this.userService = userService;
    }

    public static ProfileCommentResponse toResponse (ProfileComment profileComment) {
        return new ProfileCommentResponse(profileComment.getId(), profileComment.getCommenter().getId(), profileComment.getCommented().getId(), profileComment.getComment());
    }

    public static ProfileComment toProfileComment(CreateProfileCommentRequest dto, User user) {
        return new ProfileComment(user, dto.commented(), dto.comment());
    }

    public static ProfileCommentResponse toProfileCommentResponse(ProfileComment comment) {
        return new ProfileCommentResponse(comment.getId(), comment.getCommenter().getId(), comment.getCommented().getId(), comment.getComment());
    }
}
