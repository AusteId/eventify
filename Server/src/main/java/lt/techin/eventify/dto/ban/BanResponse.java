package lt.techin.eventify.dto.ban;

import java.time.LocalDateTime;

public record BanResponse(Long userId,
                          Long adminId,
                          String reason,
                          LocalDateTime start,
                          LocalDateTime end,
                          Boolean isActive) {
}
