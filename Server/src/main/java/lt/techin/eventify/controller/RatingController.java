package lt.techin.eventify.controller;

import jakarta.validation.Valid;
import lt.techin.eventify.dto.rating.RatingMapper;
import lt.techin.eventify.dto.rating.RatingRequest;
import lt.techin.eventify.dto.rating.RatingSummaryResponse;
import lt.techin.eventify.exception.UsernameNotFoundException;
import lt.techin.eventify.model.Rating;
import lt.techin.eventify.model.User;
import lt.techin.eventify.service.RatingService;
import lt.techin.eventify.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

  private final RatingService ratingService;
  private final UserService userService;
  private final RatingMapper ratingMapper;

  public RatingController(RatingService ratingService, UserService userService, RatingMapper ratingMapper) {
    this.ratingService = ratingService;
    this.userService = userService;
    this.ratingMapper = ratingMapper;
  }

  @PostMapping
  public ResponseEntity<Void> createRating(@Valid @RequestBody RatingRequest ratingRequest) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User rater = userService.findByUsername(authentication.getName())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    ratingService.createRating(ratingRequest, rater.getId());
    return new ResponseEntity<>(HttpStatus.CREATED);
  }

  @GetMapping("/users/{id}/rating")
  public ResponseEntity<RatingSummaryResponse> getUserRating(@PathVariable("id") Long userId) {
    User user = userService.findById(userId);
    RatingSummaryResponse response = ratingMapper.toRatingSummaryResponse(user);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/event/{eventId}/user")
  public ResponseEntity<Integer> getUserRatingForEvent(@PathVariable("eventId") Long eventId) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User rater = userService.findByUsername(authentication.getName())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    Optional<Rating> rating = ratingService.findByRaterIdAndEventId(rater.getId(), eventId);
    return rating.map(r -> ResponseEntity.ok(r.getRating()))
            .orElseGet(() -> ResponseEntity.ok(null));
  }
}
