package lt.techin.eventify.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "users")
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column(nullable = false, unique = true, length = 100)
  private String username;

  @Column(nullable = false, unique = true, length = 254)
  private String email;

  @Column(nullable = false, length = 128)
  private String password;

  private String city;

  private LocalDate birthDate;
  private String description;

  // TODO: add mapping for registrations

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
          name = "users_categories",
          joinColumns = @JoinColumn(name = "user_id"),
          inverseJoinColumns = @JoinColumn(name = "category_id")
  )
  private Set<Category> favoriteEventCategories;

  private String photoPath;
  private LocalDateTime registeredAt;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
          name = "users_roles",
          joinColumns = @JoinColumn(name = "user_id"),
          inverseJoinColumns = @JoinColumn(name = "role_id"))
  private Set<Role> roles = new HashSet<>();

  public User() {
  }

  public User(String username, String email, String password, String city, LocalDate birthDate, String description,
              Set<Category> favoriteEventCategories, String photoPath, LocalDateTime registeredAt, Set<Role> roles) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.city = city;
    this.birthDate = birthDate;
    this.description = description;
    this.favoriteEventCategories = favoriteEventCategories;
    this.photoPath = photoPath;
    this.registeredAt = registeredAt;
    this.roles = roles;
  }

  public long getId() {
    return id;
  }

  public String getUsername() {
    return username;
  }

  @Override
  public boolean isAccountNonExpired() {
    return UserDetails.super.isAccountNonExpired();
  }

  @Override
  public boolean isAccountNonLocked() {
    return UserDetails.super.isAccountNonLocked();
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return UserDetails.super.isCredentialsNonExpired();
  }

  @Override
  public boolean isEnabled() {
    return UserDetails.super.isEnabled();
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

  @Override
  public Set<? extends GrantedAuthority> getAuthorities() {
    return roles.stream().map(r -> new SimpleGrantedAuthority("ROLE_" + r.getName())).collect(Collectors.toSet());
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

  public Set<Role> getRoles() {
    return roles;
  }

  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }
}