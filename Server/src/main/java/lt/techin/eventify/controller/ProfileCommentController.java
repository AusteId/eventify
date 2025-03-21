package lt.techin.eventify.controller;

import jakarta.validation.Valid;
import lt.techin.eventify.dto.profileComment.ProfileCommentMapper;
import lt.techin.eventify.dto.profileComment.CreateProfileCommentRequest;
import lt.techin.eventify.dto.profileComment.ProfileCommentResponse;
import lt.techin.eventify.model.ProfileComment;
import lt.techin.eventify.model.User;
import lt.techin.eventify.service.ProfileCommentService;
import lt.techin.eventify.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
public class ProfileCommentController {
    private final ProfileCommentService profileCommentService;

    private final UserService userService;

    @Autowired
    public ProfileCommentController(ProfileCommentService profileCommentService, ProfileCommentMapper profileCommentMapper, UserService userService) {
        this.profileCommentService = profileCommentService;
        this.userService = userService;
    }

    @GetMapping("/comments")
    public ResponseEntity<List<ProfileComment>> getAllProfileComments() {
        return ResponseEntity.ok(profileCommentService.getProfileComments());
    }

    @GetMapping("/comments/{id}")
    public ResponseEntity<ProfileComment> getProfileComment(@PathVariable long id) {
        return ResponseEntity.ok(profileCommentService.getProfileComment(id));
    }

    @GetMapping("/{userId}/comments")
    public ResponseEntity<List<ProfileCommentResponse>> getUserProfileComments(@PathVariable long userId) {
        User user = userService.findById(userId);

        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        List<ProfileCommentResponse> commentResponses = new ArrayList<>();

        for (ProfileComment comment : user.getCommentsReceived()) {
            commentResponses.add(ProfileCommentMapper.toProfileCommentResponse(comment));
        }

        return ResponseEntity.ok(commentResponses);
    }

    @PostMapping("/comments/new")
    public ResponseEntity<ProfileCommentResponse> postComment(@Valid @RequestBody CreateProfileCommentRequest dto) {
        ProfileComment profileComment = profileCommentService.saveProfileComment(ProfileCommentMapper.toProfileComment(dto));
        ProfileCommentResponse response = ProfileCommentMapper.toProfileCommentResponse(profileComment);

        return ResponseEntity.created(
                        ServletUriComponentsBuilder.fromCurrentRequest()
                                .path("/{id}")
                                .buildAndExpand(response.id())
                                .toUri())
                .body(response);
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable long id) {
        if (profileCommentService.getProfileComment(id) == null) {
            return ResponseEntity.notFound().build();
        }
        profileCommentService.deleteProfileComment(id);
        return ResponseEntity.ok().build();
    }
}
