//package lt.techin.eventify.init;
//
//import com.fasterxml.jackson.core.type.TypeReference;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import lt.techin.eventify.dto.event.CreateEventRequest;
//import lt.techin.eventify.model.Category;
//import lt.techin.eventify.model.Event;
//import lt.techin.eventify.model.User;
//import lt.techin.eventify.repository.CategoryRepository;
//import lt.techin.eventify.repository.EventRepository;
//import lt.techin.eventify.repository.UserRepository;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.context.event.ApplicationReadyEvent;
//import org.springframework.context.event.EventListener;
//import org.springframework.core.io.ClassPathResource;
//import org.springframework.stereotype.Component;
//
//import java.io.IOException;
//import java.util.List;
//
//

//// to load events enable this component

//@Component
//public class EventDataLoader {
//
//  private static final Logger logger = LoggerFactory.getLogger(EventDataLoader.class);
//
//  private final EventRepository eventRepository;
//  private final UserRepository userRepository;
//  private final CategoryRepository categoryRepository;
//  private final ObjectMapper objectMapper;
//
//  @Autowired
//  public EventDataLoader(EventRepository eventRepository, UserRepository userRepository,
//                         CategoryRepository categoryRepository, ObjectMapper objectMapper) {
//    this.eventRepository = eventRepository;
//    this.userRepository = userRepository;
//    this.categoryRepository = categoryRepository;
//    this.objectMapper = objectMapper;
//  }
//
//  @EventListener(ApplicationReadyEvent.class)
//  public void loadEvents() {
//    try {
//      // Load JSON from resources
//      ClassPathResource resource = new ClassPathResource("data/eventData.json");
//      List<CreateEventRequest> eventDTOs = objectMapper.readValue(
//              resource.getInputStream(),
//              new TypeReference<List<CreateEventRequest>>() {
//              }
//      );
//
//      // Process each event
//      for (CreateEventRequest dto : eventDTOs) {
//        // Check if event exists by name and startDateTime (unique combo)
//        if (eventRepository.findByNameAndStartDateTime(dto.name(), dto.startDateTime()).isEmpty()) {
//          // Fetch organizer and category
//          User organizer = userRepository.findById(dto.organizer().getId())
//                  .orElseThrow(() -> new RuntimeException("Organizer not found: " + dto.organizer().getId()));
//          Category category = categoryRepository.findById(dto.category().getId())
//                  .orElseThrow(() -> new RuntimeException("Category not found: " + dto.category().getId()));
//
//          // Create and save event
//          Event event = new Event(
//                  category,
//                  organizer,
//                  dto.name(),
//                  dto.startDateTime(),
//                  dto.endDateTime(),
//                  dto.description(),
//                  dto.minAge(),
//                  dto.maxAge(),
//                  dto.experienceLevel(),
//                  dto.maxParticipants(),
//                  dto.city(),
//                  dto.address(),
//                  null // Default photoPath
//          );
//          eventRepository.save(event);
//          logger.info("Loaded event: {}", dto.name());
//        } else {
//          logger.info("Event already exists: {}", dto.name());
//        }
//      }
//    } catch (IOException e) {
//      logger.error("Failed to load events from JSON", e);
//      throw new RuntimeException("Failed to load events", e);
//    }
//  }
//}
