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

  @Column(name="phone_number", nullable = false)
  private String phone_number;

  @Column(name="email", nullable = false)
  private String email;

  @Column(name="image_url")
  private String image_url;


  public TeamMember(String name, String linkedin, String github, String phone_number, String email, String image_url) {
    this.name = name;
    this.linkedin = linkedin;
    this.github = github;
    this.phone_number = phone_number;
    this.email = email;
    this.image_url = image_url;
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

  public String getPhone_number() {
    return phone_number;
  }

  public void setPhone_number(String phone_number) {
    this.phone_number = phone_number;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getImage_url() {
    return image_url;
  }

  public void setImage_url(String image_url) {
    this.image_url = image_url;
  }
}
