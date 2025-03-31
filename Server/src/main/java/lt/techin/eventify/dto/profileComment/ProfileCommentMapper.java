package lt.techin.eventify.dto.profileComment;

import lt.techin.eventify.model.ProfileComment;
import lt.techin.eventify.model.User;
import lt.techin.eventify.service.UserService;
import org.springframework.stereotype.Component;

@Component
public class ProfileCommentMapper {
  private final UserService userService;

  public ProfileCommentMapper(UserService userService) {
    this.userService = userService;
  }

  public static ProfileCommentResponse toResponse(ProfileComment profileComment) {
    return new ProfileCommentResponse(profileComment.getId(), profileComment.getCommenter().getId(), profileComment.getCommented().getId(), profileComment.getComment());
  }

  public static ProfileComment toProfileComment(CreateProfileCommentRequest dto, User user, User commented) {
    return new ProfileComment(user, commented, dto.comment());
  }
}
