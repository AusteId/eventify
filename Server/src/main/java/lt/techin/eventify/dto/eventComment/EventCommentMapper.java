package lt.techin.eventify.dto.eventComment;

import lt.techin.eventify.dto.user.UserMapper;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.EventComment;
import lt.techin.eventify.model.User;
import org.ocpsoft.prettytime.PrettyTime;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.*;

@Component
public class EventCommentMapper {
  private static final UserMapper userMapper = new UserMapper();

  public static EventCommentResponse toResponse(EventComment eventComment) {

    String relativeTime = "Unknown time";

    LocalDateTime createdAt = eventComment.getCreatedAt();

    if (createdAt != null) {

      ZoneId lithuaniaZone = ZoneId.of("Europe/Vilnius");
      ZonedDateTime lithuaniaTime = createdAt.atZone(ZoneOffset.UTC)
              .withZoneSameInstant(lithuaniaZone);

      PrettyTime prettyTime = new PrettyTime();
      relativeTime = prettyTime.format(lithuaniaTime.toLocalDateTime());
    }

    return new EventCommentResponse(eventComment.getId(), userMapper.toUserResponse(eventComment.getUser()), eventComment.getEvent().getId(), eventComment.getComment(), relativeTime);
  }

  public static EventComment toEventComment(CreateEventCommentRequest dto, User user, Event event) {
    return new EventComment(user, event, dto.comment());
  }
}
