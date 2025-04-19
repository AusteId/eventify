package lt.techin.eventify.dto.teamMember;

import lt.techin.eventify.exception.NotFoundException;
import lt.techin.eventify.model.TeamMember;
import lt.techin.eventify.repository.mysql.TeamMemberRepository;
import org.springframework.stereotype.Component;

@Component
public class TeamMemberMapper {

  private final TeamMemberRepository teamMemberRepository;

  public TeamMemberMapper(TeamMemberRepository teamMemberRepository) {
    this.teamMemberRepository = teamMemberRepository;
  }

  public TeamMember toTeamMember(CreateTeamMemberRequest request) {
    return new TeamMember(
            request.name(),
            request.linkedin(),
            request.github(),
            request.email()
    );
  }

  public TeamMember toTeamMember(CreateTeamMemberRequest request, Long memberId) {
    TeamMember existing = teamMemberRepository.findById(memberId).orElseThrow(() -> new NotFoundException("User not " +
            "found"));
    existing.setEmail(request.email());
    existing.setLinkedin(request.linkedin());
    existing.setName(request.name());
    existing.setGithub(request.github());
    return existing;
  }

  public TeamMemberResponse toTeamMemberResponse(TeamMember teamMember) {
    return new TeamMemberResponse(
            teamMember.getId(),
            teamMember.getName(),
            teamMember.getLinkedin(),
            teamMember.getGithub(),
            teamMember.getEmail()
    );
  }
}
