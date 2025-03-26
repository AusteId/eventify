package lt.techin.eventify.controller;

import jakarta.validation.Valid;
import lt.techin.eventify.dto.eventComment.EventCommentMapper;
import lt.techin.eventify.dto.profileComment.ProfileCommentMapper;
import lt.techin.eventify.dto.profileComment.CreateProfileCommentRequest;
import lt.techin.eventify.dto.profileComment.ProfileCommentResponse;
import lt.techin.eventify.model.ProfileComment;
import lt.techin.eventify.model.User;
import lt.techin.eventify.service.ProfileCommentService;
import lt.techin.eventify.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    @GetMapping("/comments/{id}")
    public ResponseEntity<ProfileCommentResponse> getProfileComment(@PathVariable long id) {
        ProfileComment profileComment = profileCommentService.findById(id);
        if (profileComment == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(ProfileCommentMapper.toResponse(profileComment));
    }

    @GetMapping("/{userId}/comments")
    public ResponseEntity<List<ProfileCommentResponse>> getUserProfileComments(@PathVariable long userId) {
        User user = userService.findById(userId);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        List<ProfileCommentResponse> commentResponses = new ArrayList<>();

        for (ProfileComment comment : user.getCommentsReceived()) {
            commentResponses.add(ProfileCommentMapper.toResponse(comment));
        }

        return ResponseEntity.ok(commentResponses);
    }

    @PostMapping("{userId}/comments")
    public ResponseEntity<ProfileCommentResponse> postComment(@PathVariable long userId, @Valid @RequestBody CreateProfileCommentRequest dto, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().build();

        User commented = userService.findById(userId);
        if (commented == null) return ResponseEntity.notFound().build();

        if (user == commented) {
            return ResponseEntity.badRequest().build();
        }

        ProfileComment profileComment = profileCommentService.save(ProfileCommentMapper.toProfileComment(dto, user, commented));

        ProfileCommentResponse response = ProfileCommentMapper.toResponse(profileComment);

        return ResponseEntity.created(
                        ServletUriComponentsBuilder.fromCurrentRequest()
                                .path("/{id}")
                                .buildAndExpand(response.id())
                                .toUri())
                .body(response);
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable long id, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().build();

        ProfileComment profileComment = profileCommentService.findById(id);

        if (profileComment == null) {
            return ResponseEntity.notFound().build();
        }

        // You can only delete your own comments. For admins, it doesn't matter
        if ((profileComment.getCommenter() == user) || (user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN")))) {
            profileCommentService.delete(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PatchMapping("/comments/{id}")
    public ResponseEntity<ProfileCommentResponse> updateComment(@PathVariable long id, @Valid @RequestBody CreateProfileCommentRequest dto, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().build();

        ProfileComment profileComment = profileCommentService.findById(id);
        if (profileComment == null) ResponseEntity.notFound().build();

        if ((profileComment.getCommenter() == user) || (user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN")))) {
            profileComment.setComment(dto.comment());
            profileCommentService.save(profileComment);
            return ResponseEntity.ok(ProfileCommentMapper.toResponse(profileComment));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

}
