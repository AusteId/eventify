package lt.techin.eventify.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ratings", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"rater_id", "event_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Rating {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Setter(AccessLevel.NONE)
  private Long id;

  @Column(nullable = false)
  private int rating;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "rater_id", nullable = false)
  private User rater;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "organizer_id", nullable = false)
  private User organizer;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "event_id", nullable = false)
  private Event event;

  @Column(nullable = false)
  @Setter(AccessLevel.NONE)
  private LocalDateTime createdAt;

  @PrePersist
  public void prePersist() {
    if (this.createdAt == null) {
      this.createdAt = LocalDateTime.now();
    }
  }
}
