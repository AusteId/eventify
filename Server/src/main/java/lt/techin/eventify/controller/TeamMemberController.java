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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TeamMemberResponse> addTeamMember(@Valid @ModelAttribute CreateTeamMemberRequest request) {
        MultipartFile picture = request.picture();

        // Log the received picture (if any)
        logger.info("Received MultipartFile for TeamMember: {}", picture != null ? picture.getOriginalFilename() : "No picture provided");

        try {
            // If picture is provided, upload it and save the URL/key
            String savedImageKey = null; // This will hold the S3 key or URL of the uploaded image
            if (picture != null && !picture.isEmpty()) {
                savedImageKey = r2Service.uploadTeamMemberImage(picture, request.name()); // Get the image key
                logger.info("Image uploaded successfully for TeamMember: {}", request.name());
            } else {
                logger.warn("No picture provided for TeamMember: {}", request.name());
            }

            // Create and save the TeamMember
            TeamMember teamMember = teamMemberMapper.toTeamMember(request, savedImageKey); // Pass the savedImageKey to your mapper
            TeamMember saved = teamMemberService.save(teamMember);
            TeamMemberResponse response = teamMemberMapper.toTeamMemberResponse(saved);

            // Return response with the created team member
            return ResponseEntity.created(
                            ServletUriComponentsBuilder.fromCurrentRequest()
                                    .path("/{id}")
                                    .buildAndExpand(saved.getId())
                                    .toUri())
                    .body(response);

        } catch (IOException e) {
            // Handle file upload failure
            logger.error("Error uploading image for TeamMember: {}", request.name(), e);
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
        try {
            r2Service.deleteFile(String.format("team-members/%s/image.jpg", id));
            logger.info("TeamMember image deleted: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting image for TeamMember: {}", id, e);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/picture")
    public ResponseEntity<byte[]> getTeamMemberPicture(@PathVariable long id) {
        // Retrieve the image key from the service or any other logic (if applicable)
        String imageKey = teamMemberService.findImageKeyById(id);

        // Call the service method to get the image byte array
        byte[] image = r2Service.getTeamMemberImage(id, imageKey);

        // Return the image as a response with the appropriate content type
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(image);
    }
}
