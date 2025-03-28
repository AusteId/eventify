package lt.techin.eventify.dto.event;

public record EventPictureResponse(
        byte[] data,
        String contentType
) {
}
