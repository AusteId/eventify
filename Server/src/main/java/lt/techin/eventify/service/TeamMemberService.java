package lt.techin.eventify.service;

import lombok.RequiredArgsConstructor;
import lt.techin.eventify.dto.teamMember.TeamMemberMapper;
import lt.techin.eventify.dto.teamMember.TeamMemberResponse;
import lt.techin.eventify.exception.TeamMemberNotFoundException;
import lt.techin.eventify.model.TeamMember;
import lt.techin.eventify.repository.mysql.TeamMemberRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamMemberService {

    private final TeamMemberRepository teamMemberRepository;
    private final TeamMemberMapper teamMemberMapper;
    private final R2Service r2Service;

    public TeamMember save(TeamMember teamMember) {
        return teamMemberRepository.save(teamMember);
    }

    public List<TeamMember> getAll() {
        return teamMemberRepository.findAll();
    }

    public TeamMember findById(Long id) {
        return teamMemberRepository.findById(id)
                .orElseThrow(() -> new TeamMemberNotFoundException("Team member with ID " + id + " not found"));
    }

    public void delete(Long id) {
        if (!teamMemberRepository.existsById(id)) {
            throw new TeamMemberNotFoundException("Team member with ID " + id + " not found");
        }
        r2Service.deleteFile(String.format("about-us/%s/image.jpg", id));
        teamMemberRepository.deleteById(id);
    }

    public byte[] downloadAboutUsProfile(Long memberId) {
        return r2Service.downloadAboutUsAvatar(memberId);
    }

}
