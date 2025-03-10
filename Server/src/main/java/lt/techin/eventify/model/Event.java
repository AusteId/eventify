package lt.techin.eventify.model;

import jakarta.persistence.*;
import org.springframework.context.annotation.Primary;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private User organizer;


    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDateTime startDateTime;

    private LocalDateTime endDateTime;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private String description;
    private int minAge;
    private int maxAge;
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

    public Long getId() {
        return id;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public User getOrganizer() {
        return organizer;
    }

    public void setOrganizer(User organizer) {
        this.organizer = organizer;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    public LocalDateTime getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(LocalDateTime endDateTime) {
        this.endDateTime = endDateTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getMinAge() {
        return minAge;
    }

    public void setMinAge(int minAge) {
        this.minAge = minAge;
    }

    public int getMaxAge() {
        return maxAge;
    }

    public void setMaxAge(int maxAge) {
        this.maxAge = maxAge;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public int getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(int maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }
}
