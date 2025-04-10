package lt.techin.eventify.dto.message;

import jakarta.validation.constraints.NotBlank;

public record MessageDeleteRequest(
        @NotBlank(message = "Message ID cannot be empty")
        String messageId
) {}