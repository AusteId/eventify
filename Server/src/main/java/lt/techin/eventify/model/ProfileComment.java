package lt.techin.eventify.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users_comments")
@Getter
@Setter
public class ProfileComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private long id;

    @ManyToOne
    @JoinColumn(name = "commenter_id", nullable = false)
    private User commenter;

    @ManyToOne
    @JoinColumn(name = "commented_id", nullable = false)
    private User commented;

    @Column(nullable = false, length = 1000)
    private String comment;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private Timestamp createdAt;

    public ProfileComment(User commenter, User commented, String comment) {
        this.commenter = commenter;
        this.commented = commented;
        this.comment = comment;
    }

    public ProfileComment() {}
}
