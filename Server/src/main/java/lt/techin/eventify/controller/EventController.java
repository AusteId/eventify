package lt.techin.eventify.controller;

import jakarta.validation.Valid;
import lt.techin.eventify.dto.event.CreateEventRequest;
import lt.techin.eventify.dto.event.EventMapper;
import lt.techin.eventify.dto.event.EventResponse;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EventController {

    private final EventService eventService;
    private final EventMapper eventMapper;

    @Autowired
    public EventController(EventService eventService, EventMapper eventMapper) {
        this.eventService = eventService;
        this.eventMapper = eventMapper;
    }

    @PostMapping("/events")
    public ResponseEntity<EventResponse> addEvent(@Valid @RequestBody CreateEventRequest createEventRequest) {
        Event newEvent = eventService.saveEvent(eventMapper.toEvent(createEventRequest));

        return ResponseEntity.created(
                        ServletUriComponentsBuilder.fromCurrentRequest()
                                .path("/{id}")
                                .buildAndExpand(newEvent.getId())
                                .toUri())
                .body(eventMapper.toEventResponse(newEvent));
    }

    @GetMapping("/events")
    public ResponseEntity<List<Event>> getEvents() {
        return ResponseEntity.ok().body(eventService.findAllEvents());
    }
}
