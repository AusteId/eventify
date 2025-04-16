package lt.techin.eventify.controller;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import lt.techin.eventify.dto.teamMember.CreateTeamMemberRequest;
import lt.techin.eventify.dto.teamMember.TeamMemberMapper;
import lt.techin.eventify.dto.teamMember.TeamMemberResponse;
import lt.techin.eventify.model.TeamMember;
import lt.techin.eventify.service.R2Service;
import lt.techin.eventify.service.TeamMemberService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/about")
public class TeamMemberController {

    private final TeamMemberService teamMemberService;
    private final TeamMemberMapper teamMemberMapper;
    private final R2Service r2Service;
    private static final Logger logger = LoggerFactory.getLogger(TeamMemberController.class);

    @Autowired
    public TeamMemberController(TeamMemberService teamMemberService, TeamMemberMapper teamMemberMapper, R2Service r2Service) {
        this.teamMemberService = teamMemberService;
        this.teamMemberMapper = teamMemberMapper;
        this.r2Service = r2Service;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TeamMemberResponse> addTeamMember(@Valid @RequestBody CreateTeamMemberRequest request) {
        String pictureUrl = request.imageUrl();  // Using image URL directly
        String savedImageKey = null;

        try {
            if (pictureUrl != null && !pictureUrl.isBlank()) {
                // Use image URL directly
                savedImageKey = pictureUrl;
                logger.info("Image URL provided for {}", request.name());
            } else {
                logger.warn("No image URL provided for {}", request.name());
            }

            // Map the request to a team member and save it
            TeamMember teamMember = teamMemberMapper.toTeamMember(request, savedImageKey);
            TeamMember saved = teamMemberService.save(teamMember);
            TeamMemberResponse response = teamMemberMapper.toTeamMemberResponse(saved);

            // Return the response with the created team member
            return ResponseEntity.created(
                            ServletUriComponentsBuilder.fromCurrentRequest()
                                    .path("/{id}")
                                    .buildAndExpand(saved.getId())
                                    .toUri())
                    .body(response);

        } catch (Exception e) {
            logger.error("Error processing image URL for {}", request.name(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamMemberResponse> updateTeamMember(
            @PathVariable Long id,
            @Valid @RequestBody CreateTeamMemberRequest request) {

        try {
            // Fetch the existing team member
            TeamMember existingMember = teamMemberService.findById(id);

            if (existingMember == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            String pictureUrl = request.imageUrl();
            String savedImageKey = null;

            if (pictureUrl != null && !pictureUrl.isBlank()) {
                savedImageKey = pictureUrl;
                logger.info("Image URL updated for {}", request.name());
            } else {
                logger.warn("No image URL provided for {}", request.name());
            }

            // Map the updated request to the existing team member object
            TeamMember updatedMember = teamMemberMapper.toTeamMember(request, savedImageKey);
            updatedMember.setId(existingMember.getId()); // Ensure the ID remains the same
            TeamMember saved = teamMemberService.save(updatedMember);

            TeamMemberResponse response = teamMemberMapper.toTeamMemberResponse(saved);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error updating team member {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<TeamMemberResponse>> getAllTeamMembers() {
        List<TeamMemberResponse> members = teamMemberService.getAll()
                .stream()
                .map(teamMemberMapper::toTeamMemberResponse)
                .toList();
        return ResponseEntity.ok(members);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamMemberResponse> getTeamMemberById(@PathVariable Long id) {
        TeamMember member = teamMemberService.findById(id);
        return ResponseEntity.ok(teamMemberMapper.toTeamMemberResponse(member));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeamMember(@PathVariable Long id) {
        teamMemberService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
