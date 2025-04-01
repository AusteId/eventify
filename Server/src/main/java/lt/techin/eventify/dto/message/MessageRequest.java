package lt.techin.eventify.dto.message;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MessageRequest (
        @NotBlank(message = "Recipient Id cannot be null")
        Long recipientId,
        @NotBlank(message = "Message cannot be empty or null")
                @Size(max = 2000, message = "Message can only be up to 2000 characters")
        String content

) {
}
