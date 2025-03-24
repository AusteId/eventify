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
    public ResponseEntity<ProfileCommentResponse> postComment(@Valid @RequestBody CreateProfileCommentRequest dto, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().build();

        ProfileComment profileComment = profileCommentService.saveProfileComment(ProfileCommentMapper.toProfileComment(dto, user));
        ProfileCommentResponse response = ProfileCommentMapper.toProfileCommentResponse(profileComment);

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

        if (profileCommentService.getProfileComment(id) == null) {
            return ResponseEntity.notFound().build();
        }

        ProfileComment profileComment = profileCommentService.getProfileComment(id);

        // You can only delete your own comments. For admins, it doesn't matter
        if ((profileComment.getCommenter() == user) || (user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN")))) {
            profileCommentService.deleteProfileComment(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/comments/{id}")
    public ResponseEntity<ProfileComment> updateComment(@Valid @RequestBody CreateProfileCommentRequest dto, @PathVariable long id, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().build();

        ProfileComment profileComment = profileCommentService.getProfileComment(id);

        if (profileComment == null) {
            return ResponseEntity.notFound().build();
        }

        // You can only update your own comments. For admins, it doesn't matter
        if ((profileComment.getCommenter() == user) || (user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN")))) {
            profileComment.setCommented(dto.commented());
            profileComment.setCommenter(user);
            profileComment.setComment(dto.comment());
            return ResponseEntity.ok(profileCommentService.saveProfileComment(profileComment));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

}
