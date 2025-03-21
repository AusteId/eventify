package lt.techin.eventify.dto.message;

import lt.techin.eventify.model.OnlineStatus;

import java.time.LocalDateTime;

public record MessageResponse (
        Long senderId,
        Long recipientId,
        String senderName,
        String recipientName,
        LocalDateTime timestamp,
        String conversationId,
        boolean read,
        OnlineStatus onlineStatus,
        boolean isTyping,
        LocalDateTime lastSeen
){
}
