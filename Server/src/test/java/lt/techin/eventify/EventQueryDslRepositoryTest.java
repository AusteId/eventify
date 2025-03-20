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
        Pageable pageable = PageRequest.of(0, 10, Sort.by("startDateTime").ascending());

        LocalDateTime startDateTime = LocalDateTime.of(2025, 3, 1, 0, 0); // 2025-03-01 00:00
        LocalDateTime endDateTime = null; // Kol kas nenaudojame endDateTime
        Page<Event> eventPage = eventRepository.findEventsByFilters(
                "music",           // categoryName
                "Bamenda",         // city
                startDateTime,     // startDateTime
                endDateTime,       // endDateTime (praleidžiame)
                "All Welcome",     // experienceLevel
                13,                // minAge
                69,                // maxAge
                null,              // searchTerm (praleidžiame)
                pageable
        );
        assertNotNull(eventPage);
        System.out.println("Found events (All Welcome): " + eventPage.getContent());
        System.out.println("Total elements: " + eventPage.getTotalElements());
        System.out.println("Total pages: " + eventPage.getTotalPages());
    }

    @Test
    void testFindEventsByFiltersWithExtreme() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("name").descending());

        LocalDateTime startDateTime = LocalDateTime.of(2025, 3, 1, 0, 0); // 2025-03-01 00:00
        LocalDateTime endDateTime = null; // Kol kas nenaudojame endDateTime
        Page<Event> eventPage = eventRepository.findEventsByFilters(
                "music",           // categoryName
                "Bamenda",         // city
                startDateTime,     // startDateTime
                endDateTime,       // endDateTime (praleidžiame)
                "Extreme",         // experienceLevel
                13,                // minAge
                69,                // maxAge
                null,              // searchTerm (praleidžiame)
                pageable
        );
        assertNotNull(eventPage);
        System.out.println("Found events (Extreme): " + eventPage.getContent());
        System.out.println("Total elements: " + eventPage.getTotalElements());
        System.out.println("Total pages: " + eventPage.getTotalPages());
    }

    @Test
    void testFindEventsByCityVilniusWithPagination() {
        Pageable pageable = PageRequest.of(0, 2, Sort.by("startDateTime").ascending());

        Page<Event> eventPage = eventRepository.findEventsByFilters(
                null,              // categoryName (praleidžiame)
                "Vilnius",         // city
                null,              // startDateTime (praleidžiame)
                null,              // endDateTime (praleidžiame)
                null,              // experienceLevel (praleidžiame)
                null,              // minAge (praleidžiame)
                null,              // maxAge (praleidžiame)
                null,              // searchTerm (praleidžiame)
                pageable
        );
        assertNotNull(eventPage);
        System.out.println("Found events in Vilnius: " + eventPage.getContent());
        System.out.println("Total elements: " + eventPage.getTotalElements());
        System.out.println("Total pages: " + eventPage.getTotalPages());
        System.out.println("Current page: " + eventPage.getNumber());
        System.out.println("Page size: " + eventPage.getSize());
    }

    @Test
    void testFindEventsByCityVilniusAndSearchTerm() {
        Pageable pageable = PageRequest.of(0, 2, Sort.by("startDateTime").ascending());

        Page<Event> eventPage = eventRepository.findEventsByFilters(
                null,              // categoryName (praleidžiame)
                "Vilnius",         // city
                null,              // startDateTime (praleidžiame)
                null,              // endDateTime (praleidžiame)
                null,              // experienceLevel (praleidžiame)
                null,              // minAge (praleidžiame)
                null,              // maxAge (praleidžiame)
                "ante",       // searchTerm
                pageable
        );
        assertNotNull(eventPage);
        System.out.println("Found events in Vilnius with search term 'ante': " + eventPage.getContent());
        System.out.println("Total elements: " + eventPage.getTotalElements());
        System.out.println("Total pages: " + eventPage.getTotalPages());
        System.out.println("Current page: " + eventPage.getNumber());
        System.out.println("Page size: " + eventPage.getSize());
    }
}