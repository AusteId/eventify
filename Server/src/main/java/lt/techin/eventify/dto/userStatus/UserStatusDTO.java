package lt.techin.eventify.dto.userStatus;

import lt.techin.eventify.model.OnlineStatus;

import java.time.LocalDateTime;

public record UserStatusDTO(
        Long userId,
        String username,
        OnlineStatus status,
        boolean isTyping,
        String typingInConversation,
        LocalDateTime lastSeen
) {

}
