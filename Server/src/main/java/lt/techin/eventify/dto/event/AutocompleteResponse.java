package lt.techin.eventify.dto.event;

public record AutocompleteResponse(
        String street,
        String houseNumber,
        String city,
        String formatted
) {
}
