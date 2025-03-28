package lt.techin.eventify.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_images")
@Data
public class EventImage {
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
