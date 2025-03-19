package lt.techin.eventify.controller;

import jakarta.validation.Valid;
import lt.techin.eventify.dto.profileComment.ProfileCommentMapper;
import lt.techin.eventify.dto.profileComment.createProfileCommentRequest;
import lt.techin.eventify.dto.profileComment.profileCommentResponse;
import lt.techin.eventify.model.ProfileComment;
import lt.techin.eventify.service.ProfileCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class ProfileCommentController {
    private final ProfileCommentService profileCommentService;
    private final ProfileCommentMapper profileCommentMapper;

    @Autowired
    public ProfileCommentController(ProfileCommentService profileCommentService, ProfileCommentMapper profileCommentMapper) {
        this.profileCommentService = profileCommentService;
        this.profileCommentMapper = profileCommentMapper;
    }

    @GetMapping("/comments")
    public ResponseEntity<List<ProfileComment>> getAllProfileComments() {
        return ResponseEntity.ok(profileCommentService.getProfileComments());
    }

    @GetMapping("/comments/{id}")
    public ResponseEntity<ProfileComment> getProfileComment(@PathVariable long id) {
        return ResponseEntity.ok(profileCommentService.getProfileComment(id));
    }

//    @GetMapping("/{id}/comments")
//    public ResponseEntity<List<ProfileComment>> getUserProfileComments(@RequestParam long id) {
//        // TODO: Implement this
//    }

//    @PostMapping("/{id}/comments")
//    public void

    @PostMapping("/comments/new")
    public ResponseEntity<profileCommentResponse> postComment(@Valid @RequestBody createProfileCommentRequest dto) {
        ProfileComment profileComment = profileCommentService.saveProfileComment(dto);
        profileCommentResponse response = profileCommentMapper.toProfileCommentResponse(profileComment);

        return ResponseEntity.created(
                        ServletUriComponentsBuilder.fromCurrentRequest()
                                .path("/{id}")
                                .buildAndExpand(response.id())
                                .toUri())
                .body(response);
    }
}
