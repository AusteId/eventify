package lt.techin.eventify.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lt.techin.eventify.dto.event.*;
import lt.techin.eventify.dto.registrationToEvent.RegistrationToEventMapper;
import lt.techin.eventify.dto.registrationToEvent.RegistrationToEventRequest;
import lt.techin.eventify.dto.user.AvatarResponseDTO;
import lt.techin.eventify.dto.user.CreateUserRequest;
import lt.techin.eventify.dto.user.UserResponse;
import lt.techin.eventify.exception.EventNotFoundException;
import lt.techin.eventify.exception.UsernameNotFoundException;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.service.EventService;
import lt.techin.eventify.service.RegistrationToEventService;
import lt.techin.eventify.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
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
  public ResponseEntity<EventResponse> addEvent(@Valid @ModelAttribute CreateEventRequest createEventRequest) {

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
      Event newEvent = eventService.saveEvent(createEventRequest);
      return ResponseEntity.created(
                      ServletUriComponentsBuilder.fromCurrentRequest()
                              .path("/{id}")
                              .buildAndExpand(newEvent.getId())
                              .toUri())
              .body(eventMapper.toEventResponse(newEvent));
    } catch (
            IOException e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }
  }

  // For testing purposes only, to add a lot of events at once
  // disable in production

  @PostMapping("/all")
  public ResponseEntity<?> addEvent(@Valid @RequestBody List<CreateEventRequest> createEventRequest) {
    createEventRequest.forEach(item -> {
      try {
        eventService.saveEvent(item);
      } catch (IOException e) {
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
      }
    });
    return ResponseEntity.ok().build();
  }

  @GetMapping
  public ResponseEntity<List<GetEventResponse>> getAllEvents() {
    List<GetEventResponse> events = eventService.getAllEvents();
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
