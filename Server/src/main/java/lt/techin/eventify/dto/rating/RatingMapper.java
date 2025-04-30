package lt.techin.eventify.dto.rating;

import lombok.AllArgsConstructor;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.Rating;
import lt.techin.eventify.model.User;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class RatingMapper {

  public Rating toRating(RatingRequest dto, User rater, User organizer, Event event) {
    Rating rating = new Rating();
    rating.setRating(dto.rating());
    rating.setRater(rater);
    rating.setOrganizer(organizer);
    rating.setEvent(event);
    return rating;
  }

  public RatingSummaryResponse toRatingSummaryResponse(User user) {
    return new RatingSummaryResponse(
            user.getAverageRating(),
            user.getRatingCount()
    );
  }
}
