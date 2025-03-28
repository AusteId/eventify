package lt.techin.eventify.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "category_icons")
@Data
public class CategoryIcon {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String filename;
  private String contentType;

  @Lob
  @Column(name = "data", columnDefinition = "LONGBLOB")
  private byte[] data;

  private Long fileSize;
}
