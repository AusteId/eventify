package lt.techin.eventify.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Table(name = "events_comments")
@Getter
@Setter
public class EventComment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Setter(AccessLevel.NONE)
  private long id;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne
  @JoinColumn(name = "event_id", nullable = false)
  private Event event;

  @Column(nullable = false, length = 1000)
  private String comment;

  @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
  private Timestamp createdAt;

  public EventComment(User user, Event event, String comment) {
    this.user = user;
    this.event = event;
    this.comment = comment;
  }

  public EventComment() {
  }
}
