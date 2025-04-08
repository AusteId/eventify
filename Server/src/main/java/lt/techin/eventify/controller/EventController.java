package lt.techin.eventify.controller;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import lt.techin.eventify.dto.event.*;
import lt.techin.eventify.dto.registrationToEvent.RegistrationToEventMapper;
import lt.techin.eventify.dto.registrationToEvent.RegistrationToEventResponse;
import lt.techin.eventify.exception.UsernameNotFoundException;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.RegistrationToEvent;
import lt.techin.eventify.model.User;
import lt.techin.eventify.service.EventService;
import lt.techin.eventify.service.RegistrationToEventService;
import lt.techin.eventify.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/events")
public class EventController {
  private final EventService eventService;
  private final EventMapper eventMapper;
  private final RegistrationToEventMapper registrationToEventMapper;
  private final RegistrationToEventService registrationToEventService;
  private final UserService userService;
  private static final Logger logger = LoggerFactory.getLogger(EventController.class);

  @Autowired
  public EventController(EventService eventService, EventMapper eventMapper, RegistrationToEventMapper registrationToEventMapper, RegistrationToEventService registrationToEventService, UserService userService) {
    this.eventService = eventService;
    this.eventMapper = eventMapper;
    this.registrationToEventMapper = registrationToEventMapper;
    this.registrationToEventService = registrationToEventService;
    this.userService = userService;
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<EventResponse> addEvent(@Valid @ModelAttribute CreateEventRequest createEventRequest, Authentication authentication) {

    MultipartFile picture = createEventRequest.picture();
    logger.info("Received MultipartFile: {}", picture);
    if (picture == null) {
      logger.info("MultipartFile 'picture' is null");
    } else {
      logger.info("MultipartFile 'picture' - Name: {}, Size: {}, ContentType: {}, IsEmpty: {}",
              picture.getOriginalFilename(),
              picture.getSize(),
              picture.getContentType(),
              picture.isEmpty());
    }
    try {
      EventResponse newEvent = eventService.saveEvent(createEventRequest, authentication);
      return ResponseEntity.created(
                      ServletUriComponentsBuilder.fromCurrentRequest()
                              .path("/{id}")
                              .buildAndExpand(newEvent.id())
                              .toUri())
              .body(newEvent);
    } catch (
            IOException e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }
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
  public ResponseEntity<List<GetEventResponse>> getAllEvents() {
    List<GetEventResponse> events = eventService.getAllEvents();
    return ResponseEntity.ok(events);
  }

  @GetMapping("/{eventId}")
  public ResponseEntity<EventResponse> getEvent(@PathVariable Long eventId, Principal principal) {
    EventResponse event = eventService.getEventById(eventId);
    boolean isRegistered = false;
    if (principal != null) {
      try {
        User user = userService.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User " + principal.getName() + " not found"));
        isRegistered = registrationToEventService.countRegistrationsByEventIdAndUserId(eventId, user.getId()) > 0;
      } catch (UsernameNotFoundException e) {

      }

    }
    event = new EventResponse(
            event.id(),
            event.name(),
            event.startDateTime(),
            event.endDateTime(),
            event.createdAt(),
            event.description(),
            event.minAge(),
            event.maxAge(),
            event.experienceLevel(),
            event.maxParticipants(),
            event.city(),
            event.address(),
            event.photoPath(),
            event.category(),
            event.organizer(),
            event.registrations(),
            isRegistered,
            event.latitude(),
            event.longitude()
    );

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

  @GetMapping("/{id}/picture")
  public ResponseEntity<byte[]> getUserPrivateAvatar(@PathVariable long id) {
    EventPictureResponse eventPicture = eventService.getEventPicture(id);
    return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(eventPicture.contentType()))
            .body(eventPicture.data());
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

  @PostMapping("/{eventId}/register")
  public ResponseEntity<RegistrationToEventResponse> registerForEvent(@PathVariable Long eventId, Principal principal) {

    RegistrationToEvent savedRegistration = registrationToEventService.saveEventRegistration(eventId, principal.getName());

    RegistrationToEventResponse registrationToEventResponse = registrationToEventMapper.toEventRegistrationResponse(savedRegistration);

    return ResponseEntity.status(HttpStatus.CREATED).body(registrationToEventResponse);
  }

  @DeleteMapping("/{eventId}/register")
  public ResponseEntity<String> cancelRegistration(@PathVariable Long eventId, Principal principal) {
    registrationToEventService.cancelEventRegistration(eventId, principal.getName());
    return ResponseEntity.ok("Registration successfully cancelled");
  }

  @GetMapping("/upcoming")
  public ResponseEntity<List<GetEventResponse>> getUpcomingEvents() {
    return ResponseEntity.ok(eventService.findEventsInUpcoming14Days());
  }

  @GetMapping("/recommended")
  public ResponseEntity<List<GetEventResponse>> getRecommendedEvents(Principal principal) {

    return ResponseEntity.ok(eventService.findRecommendedEvents(principal.getName()));
  }


  @GetMapping("/hot")
  public ResponseEntity<List<GetEventResponse>> getHotEvents() {
    return ResponseEntity.ok(eventService.findHotEvents());
  }

  @GetMapping("/map")
  public ResponseEntity<List<EventMapResponse>> getEventsForMap(@Valid EventSearchRequest request) {

    List<EventMapResponse> events = eventService.findAllEventsForMap(
            request.categoryName(),
            request.city(),
            request.startDateTime(),
            request.endDateTime(),
            request.experienceLevel(),
            request.minAge(),
            request.maxAge(),
            request.searchTerm()
    );

    return ResponseEntity.ok(events);
  }
