package lt.techin.eventify.dto.user;

import java.time.LocalDateTime;

public record ChatContactDTO(
        Long id,
        String username,
        LocalDateTime lastInteraction
) {
}
