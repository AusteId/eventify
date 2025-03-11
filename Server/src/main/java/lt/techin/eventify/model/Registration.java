package lt.techin.eventify.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table
@Getter
@Setter
public class Registration {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Setter(AccessLevel.NONE)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  @ManyToOne
  @JoinColumn(name = "event_id")
  private Event event;

  public Registration(Long id, User user, Event event) {
    this.id = id;
    this.user = user;
    this.event = event;
  }
}
