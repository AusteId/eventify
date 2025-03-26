package lt.techin.eventify.controller;

import jakarta.validation.Valid;
import lt.techin.eventify.dto.event.*;
import lt.techin.eventify.dto.registrationToEvent.RegistrationToEventMapper;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.service.EventService;
import lt.techin.eventify.service.RegistrationToEventService;
import lt.techin.eventify.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.security.Principal;
import java.util.List;
import java.util.Map;

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
  public ResponseEntity<EventResponse> addEvent(@Valid @RequestBody CreateEventRequest createEventRequest, Authentication authentication) {
    EventResponse eventResponse = eventService.saveEvent(createEventRequest, authentication);

    return ResponseEntity.created(
                    ServletUriComponentsBuilder.fromCurrentRequest()
                            .path("/{id}")
                            .buildAndExpand(eventResponse.id())
                            .toUri())
            .body(eventResponse);
  }


  // For testing purposes only, to add a lot of events at once
  // For testing validations
  // www.mockaroo.com
//  @PostMapping("/all")
//  public ResponseEntity<?> addEvent(@Valid @RequestBody List<CreateEventRequest> createEventRequest) {
//    createEventRequest.forEach(item -> eventService.saveEvent(eventMapper.toEvent(item)));
//    ;
//    return ResponseEntity.ok().build();
//  }

  @GetMapping
  public ResponseEntity<List<EventResponse>> getAllEvents() {
    List<EventResponse> events = eventService.getAllEvents();
    return ResponseEntity.ok(events);
  }

  @GetMapping("/{eventId}")
  public ResponseEntity<EventResponse> getEvent(@PathVariable Long eventId) {
    EventResponse event = eventService.getEventById(eventId);
    return ResponseEntity.ok(event);
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

  @GetMapping("/search")
  public ResponseEntity<Page<EventResponse>> searchEvents(@Valid EventSearchRequest request) {

    Pageable pageable = PageRequest.of(
            request.page(),
            request.size(),
            Sort.by(Sort.Direction.fromString(request.sortDirection()), request.sortBy())
    );

    Page<EventResponse> eventPage = eventService.findEventsByFilters(
            request.categoryName(),
            request.city(),
            request.startDateTime(),
            request.endDateTime(),
            request.experienceLevel(),
            request.minAge(),
            request.maxAge(),
            request.searchTerm(),
            pageable
    );

    return ResponseEntity.ok(eventPage);
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
