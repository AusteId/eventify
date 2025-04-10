package lt.techin.eventify.dto.message;

import lt.techin.eventify.model.OnlineStatus;

import java.time.LocalDateTime;

public record MessageResponse(
        String id,
        Long senderId,
        Long recipientId,
        String senderName,
        String recipientName,
        String content,
        LocalDateTime timestamp,
        String conversationId,
        boolean read,
        OnlineStatus senderStatus,
        boolean isSenderTyping,
        LocalDateTime senderLastSeen,
        boolean deleted,
        LocalDateTime deletedAt,
        boolean edited,
        LocalDateTime editedAt
) {}
