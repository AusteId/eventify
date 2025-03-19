package lt.techin.eventify.model;


import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column(nullable = false, unique = true)
  private String name;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "icon_id")
  private CategoryIcon icon;


  public Category() {
  }

  public CategoryIcon getIcon() {
    return icon;
  }

  public void setIcon(CategoryIcon icon) {
    this.icon = icon;
  }

  public Category(String name) {
    this.name = name;
  }

  public long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

}
