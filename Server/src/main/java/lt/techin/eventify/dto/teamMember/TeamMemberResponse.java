package lt.techin.eventify.dto.teamMember;

public record TeamMemberResponse(
        long id,
        String name,
        String linkedin,
        String github,
        String phoneNumber,
        String email,
        String imageUrl
) {
}