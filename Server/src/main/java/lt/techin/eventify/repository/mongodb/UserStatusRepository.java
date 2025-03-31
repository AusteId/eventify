package lt.techin.eventify.repository.mongodb;


import lt.techin.eventify.model.OnlineStatus;
import lt.techin.eventify.model.UserStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserStatusRepository extends MongoRepository<UserStatus, String> {
    Optional<UserStatus> findByUserId(Long userId);
    List<UserStatus> findByIsTypingTrue();
    List<UserStatus> findByStatus(OnlineStatus status);
    void deleteByUserId(Long userId);
}
