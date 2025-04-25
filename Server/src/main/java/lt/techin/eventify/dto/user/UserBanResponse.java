package lt.techin.eventify.dto.user;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record UserBanResponse(Long id,
                              String username,
                              String email,
                              String city,
                              boolean banned,
                              LocalDateTime banEndTime,
                              String reason,
                              String adminName,
                              Long banId) {
}
