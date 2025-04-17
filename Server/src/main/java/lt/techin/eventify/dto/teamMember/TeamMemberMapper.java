package lt.techin.eventify.dto.teamMember;

import lt.techin.eventify.model.TeamMember;
import org.springframework.stereotype.Component;

@Component
public class TeamMemberMapper {

  public TeamMember toTeamMember(CreateTeamMemberRequest request) {
    return new TeamMember(
            request.name(),
            request.linkedin(),
            request.github(),
            request.email(),
            request.imageUrl()
    );
  }

  public TeamMemberResponse toTeamMemberResponse(TeamMember teamMember) {
    return new TeamMemberResponse(
            teamMember.getId(),
            teamMember.getName(),
            teamMember.getLinkedin(),
            teamMember.getGithub(),
            teamMember.getEmail(),
            teamMember.getImageUrl()
    );
  }
}
