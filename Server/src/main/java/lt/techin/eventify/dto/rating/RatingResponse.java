package lt.techin.eventify.dto.rating;

public record RatingResponse(
        int rating,
        long eventId,
        long organizerId
) {
  public RatingResponse {
    if (rating < 1 || rating > 5) {
      throw new IllegalArgumentException("Rating must be between 1 and 5");
    }
  }
}
