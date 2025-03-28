package lt.techin.eventify.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_images")
@Data
public class UserImage {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String filename;
  private String contentType;

  @Lob
  @Column(name = "data", columnDefinition = "LONGBLOB")
  private byte[] data;

  private Long fileSize;
  private LocalDateTime uploadedAt;

  @PrePersist
  public void prePersist() {
    if (this.uploadedAt == null) {
      this.uploadedAt = LocalDateTime.now();
    }
  }
}
