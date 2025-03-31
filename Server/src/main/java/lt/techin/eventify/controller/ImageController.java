package lt.techin.eventify.controller;

import lombok.AllArgsConstructor;
import lt.techin.eventify.model.EventImage;
import lt.techin.eventify.service.ImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/image")
@AllArgsConstructor
public class ImageController {

  private final ImageService imageService;

  @GetMapping("/event/{imageId}")
  public ResponseEntity<byte[]> getImage(@PathVariable Long imageId) {
    EventImage eventImage = imageService.getEventImageById(imageId);
    return ResponseEntity.ok()
            .contentType(MediaType.valueOf(eventImage.getContentType()))
            .body(eventImage.getData());
  }
}
