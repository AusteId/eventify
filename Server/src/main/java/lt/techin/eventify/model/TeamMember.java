package lt.techin.eventify.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "team_member")
@Getter
@Setter
public class TeamMember {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Setter(AccessLevel.NONE)
  private long id;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name="linkedin", nullable = false)
  private String linkedin;

  @Column(name="github", nullable = false)
  private String github;

  @Column(name="email", nullable = false)
  private String email;

  @Column(name="image_url")
  private String imageUrl;

  @Column(name="phone_number")
  private String phoneNumber = "+37000000000";

  public TeamMember(String name, String linkedin, String github, String email, String imageUrl) {
    this.name = name;
    this.linkedin = linkedin;
    this.github = github;
    this.email = email;
    this.imageUrl = imageUrl;
  }

  public TeamMember() {
  }

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getLinkedin() {
    return linkedin;
  }

  public void setLinkedin(String linkedin) {
    this.linkedin = linkedin;
  }

  public String getGithub() {
    return github;
  }

  public void setGithub(String github) {
    this.github = github;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }
}
