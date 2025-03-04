package lt.techin.eventify.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;
    
    private String city;

    private LocalDate birthDate;
    private String description;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_categories",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> favoriteEventCategories;

    private String photoPath;
    private LocalDateTime registeredAt;

    public User() {
    }

    public User(String username, String email, String city, String password, LocalDate birthDate, String description,
                Set<Category> eventCategories, String photoPath, LocalDateTime registeredAt) {
        this.username = username;
        this.email = email;
        this.city = city;
        this.password = password;
        this.birthDate = birthDate;
        this.description = description;
        this.favoriteEventCategories = eventCategories;
        this.photoPath = photoPath;
        this.registeredAt = registeredAt;
    }

    public long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Category> getFavoriteEventCategories() {
        return favoriteEventCategories;
    }

    public void setFavoriteEventCategories(Set<Category> favoriteEventCategories) {
        this.favoriteEventCategories = favoriteEventCategories;
    }

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }
}