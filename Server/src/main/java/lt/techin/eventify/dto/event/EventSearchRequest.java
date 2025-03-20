package lt.techin.eventify.dto.event;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDateTime;

public record EventSearchRequest(

        String categoryName,

        @Pattern(regexp = "^([a-zA-Z0-9\\u0080-\\u02FF\\u1E00-\\u1EFF\\u0400-\\u04FF\\u0600-\\u06FF\\u4E00-\\u9FFF]+(?:[\\s.\\-'’‘]){0,2})*[a-zA-Z0-9\\u0080-\\u02FF\\u1E00-\\u1EFF\\u0400-\\u04FF\\u0600-\\u06FF\\u4E00-\\u9FFF]*$|^$", message = "Invalid city name")
        String city,

        @Future(message = "Start date must be in the future")
        LocalDateTime startDateTime,

        @Future(message = "End date must be in the future")
        LocalDateTime endDateTime,

        @Pattern(regexp = "^(Beginner|Intermediate|Advanced|Extreme|All Welcome)?$", message = "Experience level must be Beginner, Intermediate, Advanced, Extreme, or All Welcome")
        String experienceLevel,

        @Min(value = 0, message = "Minimum age must be 0 or greater")
        @Max(value = 120, message = "Minimum age cannot be more than 120")
        Integer minAge,

        @Min(value = 0, message = "Maximum age must be 0 or greater")
        @Max(value = 120, message = "Maximum age cannot be more than 120")
        Integer maxAge,

        String searchTerm,

        @Min(value = 0, message = "Page number must be 0 or greater")
        Integer page,

        @Min(value = 1, message = "Page size must be at least 1")
        Integer size,

        String sortBy,

        @Pattern(regexp = "^(ASC|DESC)$", message = "Sort direction must be ASC or DESC")
        String sortDirection
) {

  public EventSearchRequest {
    if (page == null) {
      page = 0;
    }
    if (size == null) {
      size = 10;
    }
    if (sortBy == null || sortBy.isEmpty()) {
      sortBy = "startDateTime";
    }
    if (sortDirection == null || sortDirection.isEmpty()) {
      sortDirection = "ASC";
    }
  }
}
