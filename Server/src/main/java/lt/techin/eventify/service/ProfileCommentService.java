package lt.techin.eventify.service;

import lt.techin.eventify.dto.profileComment.ProfileCommentMapper;
import lt.techin.eventify.model.ProfileComment;
import lt.techin.eventify.repository.mysql.ProfileCommentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileCommentService {
    private final ProfileCommentRepository profileCommentRepository;
    private final ProfileCommentMapper profileCommentMapper;

    public ProfileCommentService(ProfileCommentRepository profileCommentRepository, ProfileCommentMapper profileCommentMapper) {
        this.profileCommentRepository = profileCommentRepository;
        this.profileCommentMapper = profileCommentMapper;
    }

    public List<ProfileComment> getProfileComments() {
        return profileCommentRepository.findAll();
    }

    public ProfileComment findById(long id) {
        return profileCommentRepository.findById(id).orElse(null);
    }

    public ProfileComment save(ProfileComment profileComment) {
        return profileCommentRepository.save(profileComment);
    }

    public void delete(long id) {
        profileCommentRepository.deleteById(id);
    }
}
