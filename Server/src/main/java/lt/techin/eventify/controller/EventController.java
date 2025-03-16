package lt.techin.eventify.controller;

import jakarta.validation.Valid;
import lt.techin.eventify.dto.event.CreateEventRequest;
import lt.techin.eventify.dto.event.UpdateEventRequest;
import lt.techin.eventify.dto.event.EventMapper;
import lt.techin.eventify.dto.event.EventResponse;
import lt.techin.eventify.dto.registrationToEvent.RegistrationToEventMapper;
import lt.techin.eventify.dto.registrationToEvent.RegistrationToEventRequest;
import lt.techin.eventify.exception.EventNotFoundException;
import lt.techin.eventify.exception.UsernameNotFoundException;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.RegistrationToEvent;
import lt.techin.eventify.model.User;
import lt.techin.eventify.service.EventService;
import lt.techin.eventify.service.RegistrationToEventService;
import lt.techin.eventify.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
  private final EventService eventService;
  private final EventMapper eventMapper;
  private final RegistrationToEventMapper registrationToEventMapper;
  private final RegistrationToEventService registrationToEventService;
  private final UserService userService;

  @Autowired
  public EventController(EventService eventService, EventMapper eventMapper, RegistrationToEventMapper registrationToEventMapper, RegistrationToEventService registrationToEventService, UserService userService) {
    this.eventService = eventService;
    this.eventMapper = eventMapper;
    this.registrationToEventMapper = registrationToEventMapper;
    this.registrationToEventService = registrationToEventService;
    this.userService = userService;
  }

  @PostMapping
//  public ResponseEntity<EventResponse> addEvent(@Valid @RequestBody CreateEventRequest createEventRequest, @AuthenticationPrincipal User organizer) {
  public ResponseEntity<?> addEvent(@Valid @RequestBody CreateEventRequest createEventRequest, @AuthenticationPrincipal User organizer) {
    System.out.println("ORGANIZER!!!!!!!!!!!!!!!!");
    System.out.println(organizer);
    System.out.println("ORGANIZER!!!!!!!!!!!!!!!!");
//    Event newEvent = eventService.saveEvent(eventMapper.toEvent(createEventRequest));
//    return ResponseEntity.created(
//                    ServletUriComponentsBuilder.fromCurrentRequest()
//                            .path("/{id}")
//                            .buildAndExpand(newEvent.getId())
//                            .toUri())
//            .body(eventMapper.toEventResponse(newEvent)); return ResponseEntity.created(

    return ResponseEntity.ok("eee");
  }

  @GetMapping
  public ResponseEntity<List<EventResponse>> getAllEvents() {
    List<EventResponse> events = eventService.getAllEvents();
    return ResponseEntity.ok(events);
  }

  @PutMapping("/{eventId}")
  public ResponseEntity<EventResponse> updateEvent(@PathVariable long eventId, @Valid @RequestBody UpdateEventRequest updateEventRequest) {
    Event updatedEvent = eventService.updateEvent(eventId, updateEventRequest);
    EventResponse eventResponse = eventMapper.toEventResponse(updatedEvent);
    return ResponseEntity.ok().body(eventResponse);
  }

  @DeleteMapping("/{eventId}")
  public ResponseEntity<String> deleteEvent(@PathVariable long eventId, Principal principal) {
    eventService.deleteEvent(eventId, principal);
    return ResponseEntity.noContent().build();
  }

//  @PostMapping("/{eventId}/register")
//  public void registerEvent(@PathVariable long eventId, @Valid @RequestBody RegistrationToEventRequest registrationToEventRequest, Authentication authentication) {
//    User user = userService.findByUsername(authentication.getName()).orElseThrow(() -> new UsernameNotFoundException("User does not exist."));
//    Event event = eventService.findEventById(eventId).orElseThrow(() -> new EventNotFoundException("Event does not exist."));
//
//    // check if events have available spaces
//    if (event.getMaxParticipants())
//
//    RegistrationToEvent registration = new RegistrationToEvent();
//    registration.setUser(user);
//    registration.setEvent(event);
//    registrationToEventService.saveEventRegistration(registration);
//
//  }
}
