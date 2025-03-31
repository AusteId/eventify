package lt.techin.eventify.dto.event;

import lt.techin.eventify.model.Event;

public record EventWithScore(
        Event event,
        Double score
) {
}
