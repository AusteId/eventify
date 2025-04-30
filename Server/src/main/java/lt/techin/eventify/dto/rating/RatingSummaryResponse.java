package lt.techin.eventify.dto.rating;

public record RatingSummaryResponse(
        Double averageRating,
        Integer ratingCount
) {
}
