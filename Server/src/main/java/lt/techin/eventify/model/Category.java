package lt.techin.eventify.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
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

  public Category(String name) {
        this.name = name;
    }

}
