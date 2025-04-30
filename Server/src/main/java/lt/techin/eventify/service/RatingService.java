package lt.techin.eventify.service;

import lt.techin.eventify.dto.rating.RatingMapper;
import lt.techin.eventify.dto.rating.RatingResponse;
import lt.techin.eventify.exception.RatingAlreadyExistsException;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.Rating;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.mysql.EventRepository;
import lt.techin.eventify.repository.mysql.RatingRepository;
import lt.techin.eventify.repository.mysql.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class RatingService {

  private final RatingRepository ratingRepository;
  private final UserRepository userRepository;
  private final EventRepository eventRepository;
  private final RatingMapper ratingMapper;

  public RatingService(RatingRepository ratingRepository, UserRepository userRepository,
                       EventRepository eventRepository, RatingMapper ratingMapper) {
    this.ratingRepository = ratingRepository;
    this.userRepository = userRepository;
    this.eventRepository = eventRepository;
    this.ratingMapper = ratingMapper;
  }

  public Rating createRating(RatingResponse ratingResponse, Long raterId) {

    ratingRepository.findByRaterIdAndEventId(raterId, ratingResponse.eventId())
            .ifPresent(rating -> {
              throw new RatingAlreadyExistsException("You have already rated this event");
            });

    User rater = userRepository.findById(raterId)
            .orElseThrow(() -> new IllegalArgumentException("Rater with ID " + raterId + " not found"));
    User organizer = userRepository.findById(ratingResponse.organizerId())
            .orElseThrow(() -> new IllegalArgumentException("Organizer with ID " + ratingResponse.organizerId() + " not found"));
    Event event = eventRepository.findById(ratingResponse.eventId())
            .orElseThrow(() -> new IllegalArgumentException("Event with ID " + ratingResponse.eventId() + " not found"));

    Rating rating = ratingMapper.toRating(ratingResponse, rater, organizer, event);
    ratingRepository.save(rating);
    updateOrganizerRating(organizer, rating.getRating());

    return rating;
  }

  private void updateOrganizerRating(User organizer, int newRating) {

    Integer ratingCount = organizer.getRatingCount();
    Double averageRating = organizer.getAverageRating();

    if (ratingCount == null || averageRating == null) {
      organizer.setRatingCount(1);
      organizer.setAverageRating((double) newRating);
    } else {
      double newAverage = (averageRating * ratingCount + newRating) / (ratingCount + 1);
      organizer.setAverageRating(newAverage);
      organizer.setRatingCount(ratingCount + 1);
    }

    userRepository.save(organizer);
  }
}
