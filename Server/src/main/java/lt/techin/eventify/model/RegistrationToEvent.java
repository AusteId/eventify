package lt.techin.eventify.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lt.techin.eventify.dto.event.EventResponse;

import java.time.LocalDateTime;
import java.util.Optional;

@Entity
@Table(name = "registrations")
@Getter
@Setter
public class RegistrationToEvent {
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

  @Column(nullable = false, name = "registered_at")
  @Setter(AccessLevel.NONE)
  private LocalDateTime registeredAt;

    public RegistrationToEvent(User user, EventResponse event, LocalDateTime now) {
    }

    @PrePersist
  public void prePersist() {
    if (this.registeredAt == null) {
      this.registeredAt = LocalDateTime.now();
    }
  }

  public RegistrationToEvent(User user, Event event, LocalDateTime registeredAt) {
    this.user = user;
    this.event = event;
  }


}