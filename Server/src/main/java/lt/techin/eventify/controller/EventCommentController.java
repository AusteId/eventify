package lt.techin.eventify.controller;

import jakarta.validation.Valid;
import lt.techin.eventify.dto.eventComment.CreateEventCommentRequest;
import lt.techin.eventify.dto.eventComment.EventCommentMapper;
import lt.techin.eventify.dto.eventComment.EventCommentResponse;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.EventComment;
import lt.techin.eventify.model.User;
import lt.techin.eventify.service.EventCommentService;
import lt.techin.eventify.service.EventService;
import lt.techin.eventify.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventCommentController {
  private final EventCommentService eventCommentService;
  private final EventService eventService;
  private final UserService userService;

  @Autowired
  public EventCommentController(EventCommentService eventCommentService, EventService eventService, UserService userService) {
    this.eventCommentService = eventCommentService;
    this.eventService = eventService;
    this.userService = userService;
  }

  @GetMapping("{eventId}/comments")
  public ResponseEntity<List<EventCommentResponse>> getCommentsByEvent(@PathVariable long eventId) {
    Event event = eventService.findById(eventId);

    if (event == null) {
      return ResponseEntity.notFound().build();
    }

    List<EventCommentResponse> responses = new ArrayList<>();

    for (EventComment eventComment : event.getComments()) {
      responses.add(EventCommentMapper.toResponse(eventComment));
    }

    return ResponseEntity.ok(responses);
  }

  @PostMapping("/{eventId}/comments")
  public ResponseEntity<EventCommentResponse> postComment(@Valid @RequestBody CreateEventCommentRequest dto, @PathVariable long eventId, Authentication authentication) {
    User user = userService.findByUsername(authentication.getName()).orElse(null);
    if (user == null) return ResponseEntity.badRequest().build();

    Event event = eventService.findById(eventId);

    if (event == null) {
      return ResponseEntity.badRequest().build();
    }

    EventComment eventComment = eventCommentService.save(EventCommentMapper.toEventComment(dto, user, event));
    if (eventComment == null) return ResponseEntity.notFound().build();

    EventCommentResponse response = EventCommentMapper.toResponse(eventComment);

    return ResponseEntity.created(
                    ServletUriComponentsBuilder.fromCurrentRequest()
                            .path("/{eventId}")
                            .buildAndExpand(response.id())
                            .toUri())
            .body(response);

  }

  @DeleteMapping("/comments/{id}")
  public ResponseEntity<?> deleteComment(@PathVariable long id, Authentication authentication) {
    User user = userService.findByUsername(authentication.getName()).orElse(null);
    if (user == null) return ResponseEntity.badRequest().build();

    EventComment eventComment = eventCommentService.findById(id);
    if (eventComment == null) return ResponseEntity.notFound().build();

    if ((eventComment.getUser() == user) || (user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN")))) {
      eventCommentService.delete(id);
      return ResponseEntity.ok().build();
    } else {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
  }

  @PatchMapping("/comments/{id}")
  public ResponseEntity<EventCommentResponse> updateComment(@PathVariable long id, @Valid @RequestBody CreateEventCommentRequest dto, Authentication authentication) {
    User user = userService.findByUsername(authentication.getName()).orElse(null);
    if (user == null) return ResponseEntity.badRequest().build();

    EventComment eventComment = eventCommentService.findById(id);
    if (eventComment == null) return ResponseEntity.notFound().build();

    if ((eventComment.getUser() == user) || (user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN")))) {
      eventComment.setComment(dto.comment());
      eventCommentService.save(eventComment);
      return ResponseEntity.ok(EventCommentMapper.toResponse(eventComment));
    } else {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
  }

}
