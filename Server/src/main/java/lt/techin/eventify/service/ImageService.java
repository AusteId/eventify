package lt.techin.eventify.service;

import lombok.AllArgsConstructor;
import lt.techin.eventify.exception.EventImageNotFound;
import lt.techin.eventify.model.EventImage;
import lt.techin.eventify.repository.mysql.EventImageRepository;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ImageService {

  private final EventImageRepository eventImageRepository;

  public EventImage getEventImageById(Long eventId) {
    return eventImageRepository.findEventImageById(eventId).orElseThrow(() -> new EventImageNotFound("Event image was not found"));
  }
}
