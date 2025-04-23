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

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String linkedin;

  @Column(nullable = false)
  private String github;

  @Column(nullable = false)
  private String email;


  public TeamMember(String name, String linkedin, String github, String email) {
    this.name = name;
    this.linkedin = linkedin;
    this.github = github;
    this.email = email;
  }

  public TeamMember() {
  }

}
