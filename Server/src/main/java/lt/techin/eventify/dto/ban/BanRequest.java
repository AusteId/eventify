package lt.techin.eventify.dto.ban;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.Range;

public record BanRequest(Long userId,
                         Long adminId,
                         @Size(min = 3, max = 1000, message = "Must provide a reason")
                         String reason,
                         @Positive(message = "Number must be positive")
                         @Range(min = 1, max = 365)
                         Long duration) {

}
