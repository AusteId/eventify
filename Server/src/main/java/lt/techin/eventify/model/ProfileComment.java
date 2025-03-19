package lt.techin.eventify.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users_comments")
public class ProfileComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private long id;

//    @Column(nullable = false, name = "commenter_id")
//    private long commenterId;
//
//    @Column(nullable = false, name = "commented_id")
//    private long commentedId;

    @ManyToOne
    @JoinColumn(name = "commenter_id", nullable = false)
    private User commenter;

    @ManyToOne
    @JoinColumn(name = "commented_id", nullable = false) // Nullable for top-level comments
    private User commented;

    @Column(nullable = false, length = 1000)
    private String comment;

    @Column(nullable = false)
    private Timestamp createdAt;

    public ProfileComment(long id, User commenter, User commented, String comment, Timestamp createdAt) {
        this.id = id;
        this.commenter = commenter;
        this.commented = commented;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public ProfileComment() {}

    public long getId() {
        return id;
    }

    public User getCommenter() {
        return commenter;
    }

    public void setCommenter(User commenter) {
        this.commenter = commenter;
    }

    public User getCommented() {
        return commented;
    }

    public void setCommented(User commented) {
        this.commented = commented;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
