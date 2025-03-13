package lt.techin.eventify.controller;

import jakarta.validation.Valid;
import lt.techin.eventify.dto.registrationToEvent.RegistrationToEventRequest;
import lt.techin.eventify.model.RegistrationToEvent;
import lt.techin.eventify.service.RegistrationToEventService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/event")
public class RegistrationToEventController {

    private final RegistrationToEventService registrationToEventService;

    public RegistrationToEventController(RegistrationToEventService registrationToEventService) {
        this.registrationToEventService = registrationToEventService;
    }

    @PostMapping("{eventId}/register")
    public void registerEvent(@PathVariable long eventId, @Valid @RequestBody RegistrationToEventRequest registrationToEventRequest, Authentication authentication) {

        registrationToEventService.saveEventRegistration();

    }
}
