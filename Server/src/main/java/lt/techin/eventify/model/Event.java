package lt.techin.eventify.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "events")
@Getter
@Setter
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private long id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "category_id", nullable = false)
  private Category category;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "organizer_id", nullable = false)
  private User organizer;

  // if event is deleted registration should be deleted as well
  @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @JoinColumn(name = "event_id")
  private List<RegistrationToEvent> registrationToEvents;

  @Column(nullable = false, length = 100)
  private String name;

  @Column(nullable = false)
  private LocalDateTime startDateTime;

  private LocalDateTime endDateTime;

  @Column(nullable = false)
  @Setter(AccessLevel.NONE)
  private LocalDateTime createdAt;

  @Column(length = 1000)
  private String description;

  private int minAge;

  private int maxAge;

  @Column(length = 50)
  private String experienceLevel;

  @Column(nullable = false)
  private int maxParticipants;

  @Column(nullable = false, length = 200)
  private String city;

  @Column(nullable = false)
  private String address;

  private String photoPath;

  @PrePersist
  public void prePersist() {
    if (this.createdAt == null) {
      this.createdAt = LocalDateTime.now();
    }
  }

  public Event(Category category, User organizer, String name, LocalDateTime startDateTime,
               LocalDateTime endDateTime, LocalDateTime createdAt, String description,
               int minAge, int maxAge, String experienceLevel, int maxParticipants,
               String city, String address, String photoPath) {
    this.category = category;
    this.organizer = organizer;
    this.name = name;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.createdAt = createdAt;
    this.description = description;
    this.minAge = minAge;
    this.maxAge = maxAge;
    this.experienceLevel = experienceLevel;
    this.maxParticipants = maxParticipants;
    this.city = city;
    this.address = address;
    this.photoPath = photoPath;
  }

  public Event() {
  }

}
