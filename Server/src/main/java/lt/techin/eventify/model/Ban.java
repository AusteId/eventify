package lt.techin.eventify.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "bans",indexes = {
        @Index(name = "idx_ban_active",columnList = "active"),
        @Index(name = "idx_ban_endtime",columnList = "end_time"),
        @Index(name = "idx_ban_user_active",columnList = "user_id,active"),
        @Index(name = "idx_ban_id_active", columnList = "id, active")
})
@Getter
@Setter
public class Ban {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private User admin;

    private String reason;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private boolean active;

    public Ban() {

    }
}
