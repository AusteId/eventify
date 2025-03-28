package lt.techin.eventify.dto.user;

public record AvatarResponseDTO(
        byte[] data,
        String contentType
) {
}
