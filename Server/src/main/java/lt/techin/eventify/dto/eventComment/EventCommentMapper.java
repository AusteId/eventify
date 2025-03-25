package lt.techin.eventify.dto.eventComment;

import lt.techin.eventify.dto.user.UserMapper;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.EventComment;
import lt.techin.eventify.model.User;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;

@Component
public class EventCommentMapper {
    private static final UserMapper userMapper = new UserMapper();

    public static EventCommentResponse toResponse(EventComment eventComment) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        String time = sdf.format(eventComment.getCreatedAt());
        return new EventCommentResponse(eventComment.getId(), userMapper.toUserResponse(eventComment.getUser()) , eventComment.getEvent().getId(), eventComment.getComment(), time);
    }

    public static EventComment toEventComment(CreateEventCommentRequest dto, User user, Event event) {
        return new EventComment(user, event, dto.comment());
    }
}
