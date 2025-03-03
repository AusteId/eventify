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

    public Category() {
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

    //    SPORTS,
//    BOARDGAMES,
//    MUSIC,
//    ARTS_AND_CULTURE,
//    FOOD_AND_DRINKS,
//    OUTDOOR,
//    WELLNESS,
//    BUSINESS,
//    TECHNOLOGY
}
