package lt.techin.eventify;

import lt.techin.eventify.model.Event;
import lt.techin.eventify.repository.EventQueryDslRepositoryImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class EventQueryDslRepositoryTest {

    @Autowired
    private EventQueryDslRepositoryImpl eventRepository;

    @Test
    void testFindEventsByFiltersWithAllWelcome() {
        // Puslapiavimas: 1 puslapis (page = 0), 10 įrašų per puslapį, rūšiuoti pagal startDateTime didėjančia tvarka
        Pageable pageable = PageRequest.of(0, 10, Sort.by("startDateTime").ascending());

        LocalDateTime startDateTime = LocalDateTime.of(2025, 3, 1, 0, 0); // 2025-03-01 00:00
        LocalDateTime endDateTime = null;
        Page<Event> eventPage = eventRepository.findEventsByFilters(
                "music",           // categoryName
                "Bamenda",         // city
                startDateTime,     // startDateTime
                endDateTime,       // endDateTime (praleidžiame)
                "All Welcome",     // experienceLevel
                13,                // minAge
                69,                // maxAge
                pageable
        );
        assertNotNull(eventPage);
        System.out.println("Found events (All Welcome): " + eventPage.getContent());
        System.out.println("Total elements: " + eventPage.getTotalElements());
        System.out.println("Total pages: " + eventPage.getTotalPages());
    }

    @Test
    void testFindEventsByFiltersWithExtreme() {
        // Puslapiavimas: 1 puslapis (page = 0), 10 įrašų per puslapį, rūšiuoti pagal name mažėjančia tvarka
        Pageable pageable = PageRequest.of(0, 10, Sort.by("name").descending());

        LocalDateTime startDateTime = LocalDateTime.of(2025, 3, 1, 0, 0); // 2025-03-01 00:00
        LocalDateTime endDateTime = null;
        Page<Event> eventPage = eventRepository.findEventsByFilters(
                "music",           // categoryName
                "Bamenda",         // city
                startDateTime,     // startDateTime
                endDateTime,       // endDateTime (praleidžiame)
                "Extreme",         // experienceLevel
                13,                // minAge
                69,                // maxAge
                pageable
        );
        assertNotNull(eventPage);
        System.out.println("Found events (Extreme): " + eventPage.getContent());
        System.out.println("Total elements: " + eventPage.getTotalElements());
        System.out.println("Total pages: " + eventPage.getTotalPages());
    }

    @Test
    void testFindEventsByCityVilniusWithPagination() {
        // Puslapiavimas: 1 puslapis (page = 0), 2 įrašai per puslapį, rūšiuoti pagal startDateTime didėjančia tvarka
        Pageable pageable = PageRequest.of(0, 2, Sort.by("startDateTime").ascending());

        Page<Event> eventPage = eventRepository.findEventsByFilters(
                null,              // categoryName (praleidžiame)
                "Vilnius",         // city
                null,              // startDateTime (praleidžiame)
                null,              // endDateTime (praleidžiame)
                null,              // experienceLevel (praleidžiame)
                null,              // minAge (praleidžiame)
                null,              // maxAge (praleidžiame)
                pageable
        );
        assertNotNull(eventPage);
        System.out.println("Found events in Vilnius: " + eventPage.getContent());
        System.out.println("Total elements: " + eventPage.getTotalElements());
        System.out.println("Total pages: " + eventPage.getTotalPages());
        System.out.println("Current page: " + eventPage.getNumber());
        System.out.println("Page size: " + eventPage.getSize());
    }

}