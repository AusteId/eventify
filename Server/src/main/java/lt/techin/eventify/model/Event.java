package lt.techin.eventify.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @Getter
    @Setter
    private Category category;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    @Getter
    @Setter
    private User organizer;


    @Getter
    @Setter
    @Column(nullable = false)
    private String name;

    @Getter
    @Setter
    @Column(nullable = false)
    private LocalDateTime startDateTime;

    @Getter
    @Setter
    private LocalDateTime endDateTime;

    @Column(nullable = false)
    @Getter
    private LocalDateTime createdAt;

    @Getter
    @Setter
    private String description;

    @Getter
    @Setter
    private int minAge;

    @Getter
    @Setter
    private int maxAge;

    @Getter
    @Setter
    private String experienceLevel;

    @Column(nullable = false)
    private int maxParticipants;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String address;

    private String photoPath;

    public Event() {
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

}
