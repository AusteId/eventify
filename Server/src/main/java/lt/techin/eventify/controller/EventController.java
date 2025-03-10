package lt.techin.eventify.controller;

import jakarta.validation.Valid;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api")
public class EventController {

  private final EventService eventService;

  public EventController(EventService eventService) {
    this.eventService = eventService;
  }

  @PostMapping("/events")
  public ResponseEntity<Event> addEvent(@Valid @RequestBody Event event) {
    Event newEvent = eventService.saveEvent(event);

    return ResponseEntity.created(
                    ServletUriComponentsBuilder.fromCurrentRequest()
                            .path("/{id}")
                            .buildAndExpand(newEvent.getId())
                            .toUri())
            .body(newEvent);
  }

  @GetMapping("/events")
  public ResponseEntity<?> getEvents() {
    System.out.println(System.getenv("DB_PASSWORD"));
    return ResponseEntity.ok().body("newEvent");
  }
}
