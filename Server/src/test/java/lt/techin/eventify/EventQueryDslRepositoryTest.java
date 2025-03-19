package lt.techin.eventify;

import lt.techin.eventify.model.Event;
import lt.techin.eventify.repository.EventQueryDslRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class EventQueryDslRepositoryTest {

    @Autowired
    private EventQueryDslRepository eventRepository;

    @Test
    void testFindEventsByFilters() {
        LocalDateTime startDateTime = LocalDateTime.of(2025, 3, 1, 0, 0); // 2025-03-01 00:00
        LocalDateTime endDateTime = null; // Kol kas nenaudojame endDateTime
        List<Event> events = eventRepository.findEventsByFilters(
                "music",           // categoryName
                "Bamenda",         // city
                startDateTime,     // startDateTime
                endDateTime,       // endDateTime (praleidžiame)
                "All Welcome",     // experienceLevel
                15,                // minAge
                60                 // maxAge
        );
        assertNotNull(events);
        System.out.println("Found events: " + events);
    }
}