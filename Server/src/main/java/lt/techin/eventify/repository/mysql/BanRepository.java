package lt.techin.eventify.repository.mysql;

import lt.techin.eventify.model.Ban;
import lt.techin.eventify.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BanRepository extends JpaRepository<Ban,Long> {
    List<Ban> findByEndTimeBeforeAndActiveTrue(LocalDateTime endTimeBefore);

    Page<Ban> findByUser(User user, Pageable pageable);

    Optional<Ban> findByIdAndActiveTrue(Long banId);

    Optional<Ban> findByUserAndActiveTrue(User user);
    @Query("SELECT b FROM Ban b WHERE " +
            "(:userId IS NULL OR b.user.id = :userId) AND " +
            "(:adminId IS NULL OR b.admin.id = :adminId) AND " +
            "(:active IS NULL OR b.active = :active) AND " +
            "(:startDateAfter IS NULL OR b.startTime >= :startDateAfter) AND " +
            "(:startDateBefore IS NULL OR b.startTime <= :startDateBefore) AND " +
            "(:endDateAfter IS NULL OR b.endTime >= :endDateAfter) AND " +
            "(:endDateBefore IS NULL OR b.endTime <= :endDateBefore)")
    Page<Ban> findWithFilters(
            @Param("userid") Long userId,
            @Param("adminId") Long adminId,
            @Param("active") Boolean active,
            @Param("startDateAfter") LocalDateTime startDateAfter,
            @Param("startDateBefore") LocalDateTime startDateBefore,
            @Param("endDateAfter") LocalDateTime endDateAfter,
            @Param("endDateBefore") LocalDateTime endDateBefore,
            Pageable pageable
    );

    Long user(User user);
}
