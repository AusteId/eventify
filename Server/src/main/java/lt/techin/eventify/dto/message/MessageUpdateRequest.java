package lt.techin.eventify.dto.message;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MessageUpdateRequest(
        @NotBlank(message = "Message ID cannot be empty")
        String messageId,

        @NotBlank(message = "Content cannot be empty")
        @Size(max = 2000, message = "Message can only be up to 2000 characters")
        String content
) {}