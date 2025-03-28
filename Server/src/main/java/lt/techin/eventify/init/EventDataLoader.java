package lt.techin.eventify.init;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lt.techin.eventify.dto.event.CreateEventRequest;
import lt.techin.eventify.repository.mysql.EventRepository;
import lt.techin.eventify.service.EventService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
@AllArgsConstructor
public class EventDataLoader {

  private static final Logger logger = LoggerFactory.getLogger(EventDataLoader.class);

  private final EventRepository eventRepository;
  private final EventService eventService;
  private final ObjectMapper objectMapper;

  @EventListener(ApplicationReadyEvent.class)
  public void loadEvents() {
    try {
      ClassPathResource resource = new ClassPathResource("data/eventData.json");
      List<CreateEventRequest> eventDTOs = objectMapper.readValue(
              resource.getInputStream(),
              new TypeReference<List<CreateEventRequest>>() {
              }
      );

      for (CreateEventRequest dto : eventDTOs) {
        if (dto == null) {
          logger.warn("Skipping null event in eventData.json");
          continue;
        }
        if (eventRepository.findByNameAndStartDateTime(dto.name(), dto.startDateTime()).isEmpty()) {
          eventService.saveEvent(dto); // Use EventService to save the event
          logger.info("Loaded event: {}", dto.name());
        } else {
          logger.info("Event already exists: {}", dto.name());
        }
      }
    } catch (IOException e) {
      logger.error("Failed to load events from JSON", e);
      throw new RuntimeException("Failed to load events", e);
    }
  }
}