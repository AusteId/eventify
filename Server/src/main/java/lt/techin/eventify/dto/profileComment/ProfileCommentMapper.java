package lt.techin.eventify.dto.profileComment;

import lt.techin.eventify.dto.user.UserMapper;
import lt.techin.eventify.model.ProfileComment;
import lt.techin.eventify.model.User;
import lt.techin.eventify.service.UserService;
import lt.techin.eventify.util.TimeConverter;
import org.springframework.stereotype.Component;

@Component
public class ProfileCommentMapper {
  private final UserService userService;

  private static final UserMapper userMapper = new UserMapper();

  private static final TimeConverter timeConverter = new TimeConverter();

  public ProfileCommentMapper(UserService userService) {
    this.userService = userService;
  }

  public static ProfileCommentResponse toResponse(ProfileComment profileComment) {

    String time = timeConverter.convert(profileComment.getCreatedAt());

    return new ProfileCommentResponse(profileComment.getId(), userMapper.toUserResponse(profileComment.getCommenter()), profileComment.getCommenter().getId(), profileComment.getCommented().getId(), profileComment.getComment(), time);
  }

  public static ProfileComment toProfileComment(CreateProfileCommentRequest dto, User user, User commented) {
    return new ProfileComment(user, commented, dto.comment());
  }
}
