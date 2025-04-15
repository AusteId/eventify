package lt.techin.eventify.dto.teamMember;

import lt.techin.eventify.model.TeamMember;
import org.springframework.stereotype.Component;

@Component
public class TeamMemberMapper {

  public TeamMember toTeamMember(CreateTeamMemberRequest request, String savedImageUrl) {
    return new TeamMember(
            request.name(),
            request.linkedin(),
            request.github(),
            request.phoneNumber(),
            request.email(),
            savedImageUrl
    );
  }

  public TeamMemberResponse toTeamMemberResponse(TeamMember teamMember) {
    return new TeamMemberResponse(
            teamMember.getId(),
            teamMember.getName(),
            teamMember.getLinkedin(),
            teamMember.getGithub(),
            teamMember.getPhone_number(),
            teamMember.getEmail(),
            teamMember.getImage_url()
    );
  }
}
