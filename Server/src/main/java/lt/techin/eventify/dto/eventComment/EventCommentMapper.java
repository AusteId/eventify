package lt.techin.eventify.dto.eventComment;

import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.EventComment;
import lt.techin.eventify.model.User;
import org.springframework.stereotype.Component;

@Component
public class EventCommentMapper {
  public static EventCommentResponse toResponse(EventComment eventComment) {
    return new EventCommentResponse(eventComment.getId(), eventComment.getUser().getId(), eventComment.getEvent().getId(), eventComment.getComment());
  }

  public static EventComment toEventComment(CreateEventCommentRequest dto, User user, Event event) {
    return new EventComment(user, event, dto.comment());
  }
}
