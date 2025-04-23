package lt.techin.eventify.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

// TODO: use lombok setters and getters
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_username", columnList = "username"),
        @Index(name = "idx_user_email", columnList = "email")
})
@NoArgsConstructor
@Setter
@Getter
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Setter(AccessLevel.NONE)
  private Long id;

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


  // TODO: add mapping for organizer (to Event)


  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
          name = "users_categories",
          joinColumns = @JoinColumn(name = "user_id"),
          inverseJoinColumns = @JoinColumn(name = "category_id")
  )

  private Set<Category> favoriteEventCategories;

  @OneToMany
  @JoinColumn(name = "commenter_id")
  private Set<ProfileComment> commentsMade; // Comments this user posted

  @OneToMany
  @JoinColumn(name = "commented_id")
  private Set<ProfileComment> commentsReceived; // Comments posted on this user

  @Setter(AccessLevel.NONE)
  private LocalDateTime registeredAt;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
          name = "users_roles",
          joinColumns = @JoinColumn(name = "user_id"),
          inverseJoinColumns = @JoinColumn(name = "role_id"),
          indexes = {
                  @Index(name = "idx_users_roles_user_id", columnList = "user_id"),
                  @Index(name = "idx_users_roles_role_id", columnList = "role_id")
          })
  private Set<Role> roles = new HashSet<>();

@OneToMany(mappedBy = "user")
private List<Ban> bans;


  @OneToMany(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private Set<RegistrationToEvent> registrations = new HashSet<>();

  public User(String username, String email, String password, String city, LocalDate birthDate, String description,
              Set<Category> favoriteEventCategories, Set<Role> roles) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.city = city;
    this.birthDate = birthDate;
    this.description = description;
    this.favoriteEventCategories = favoriteEventCategories;
    this.roles = roles;
    this.registrations = new HashSet<>();
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

  @Override
  public Set<? extends GrantedAuthority> getAuthorities() {
    return roles.stream().map(r -> new SimpleGrantedAuthority("ROLE_" + r.getName())).collect(Collectors.toSet());
  }

  @PrePersist
  public void prePersist() {
    if (this.registeredAt == null) {
      this.registeredAt = LocalDateTime.now();
    }
  }
}