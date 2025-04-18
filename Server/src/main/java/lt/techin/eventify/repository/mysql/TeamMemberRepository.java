package lt.techin.eventify.repository.mysql;

import lt.techin.eventify.model.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import java.util.List;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    List<TeamMember> findByNameContainingIgnoreCase(String name);

    boolean existsByEmail(String email);

    List<TeamMember> findByGithubContainingIgnoreCase(String github);

    List<TeamMember> findByLinkedinContainingIgnoreCase(String linkedin);

    @Query("SELECT e.imageKey FROM Event e WHERE e.id = :eventId")
    Optional<String> findImageKeyById(@Param("eventId") Long id);
}
