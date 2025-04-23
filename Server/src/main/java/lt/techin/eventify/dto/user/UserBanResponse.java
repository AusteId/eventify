package lt.techin.eventify.dto.user;

import java.time.LocalDate;

public record UserBanResponse(Long id,
                             String username,
                             String email,
                             String city) {
}
