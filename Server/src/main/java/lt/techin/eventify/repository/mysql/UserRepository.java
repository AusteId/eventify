package lt.techin.eventify.repository.mysql;

import lt.techin.eventify.model.Role;
import lt.techin.eventify.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserRepository extends JpaRepository<User, Long> {

  boolean existsByEmail(String email);

  boolean existsByUsername(String username);

  Optional<User> findByUsername(String username);

  Optional<User> findByEmail(String username);

  List<User> findByUsernameContainingIgnoreCaseAndIdNot(String username, Long notId, Pageable pageable);

  List<User> findByIdIn(List<Long> ids);

  Page<User> findByRolesContaining(Role role, Pageable pageable);

  @Query("SELECT u FROM User u WHERE " +
          "(:searchTerm IS NULL OR " +
          "LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
          "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
          "(:excludeAdmin = false OR LOWER(u.username) NOT LIKE '%admin%')")
  Page<User> findBySearchTermWithAdminExclusion(
          @Param("searchTerm") String searchTerm,
          @Param("excludeAdmin") boolean excludeAdmin,
          Pageable pageable
  );
}
