package lt.techin.eventify.service;

import lombok.AllArgsConstructor;
import lt.techin.eventify.dto.event.*;
import lt.techin.eventify.exception.*;
import lt.techin.eventify.model.Category;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.mysql.CategoryRepository;
import lt.techin.eventify.repository.mysql.EventRepository;
import lt.techin.eventify.repository.mysql.RegistrationToEventRepository;
import lt.techin.eventify.repository.mysql.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.Principal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.*;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class EventService {

  private static final Logger logger = LoggerFactory.getLogger(EventService.class);

  private final EventRepository eventRepository;
  private final CategoryRepository categoryRepository;
  private final UserRepository userRepository;
  private final EventMapper eventMapper;
  private final RegistrationToEventRepository registrationToEventRepository;

//  public Event saveEvent(CreateEventRequest createEventRequest) throws IOException {
//    Event newEvent = eventMapper.toEvent(createEventRequest);

  @CacheEvict(value = "eventsCache", allEntries = true)
  @CachePut(value = "eventsCache")
  public EventResponse saveEvent(CreateEventRequest createEventRequest, Authentication authentication) throws IOException {
    JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
    Map<String, Object> claims = jwtAuth.getTokenAttributes();
    Long userId = (Long) claims.get("userId");

    User organizer = userRepository.findById(userId).orElseThrow(() ->
            new UsernameNotFoundException("User does not exist"));

    Category category = categoryRepository.findById(createEventRequest.categoryId()).orElseThrow(() -> new CategoryNotFoundException("Category does not exist"));
    Event event = eventMapper.toEvent(createEventRequest, category, organizer);
    Event savedEvent = eventRepository.save(event);

    return eventMapper.toEventResponse(savedEvent);
  }

  @CacheEvict(value = "eventsCache", allEntries = true)
  public Event updateEvent(long eventId, UpdateEventRequest updateEventRequest) {

    Event event = eventRepository.findById(eventId).orElseThrow(() ->
            new EventNotFoundException("Event with ID " + eventId + " not found"));

    Category category = categoryRepository.findByName(updateEventRequest.categoryName()).orElseThrow(() ->
            new CategoryNotFoundException("Category '" + updateEventRequest.categoryName() + "' not found"));

    event.setCategory(category);
    event.setName(updateEventRequest.name());
    event.setStartDateTime(updateEventRequest.startDateTime());
    event.setEndDateTime(updateEventRequest.endDateTime());
    event.setDescription(updateEventRequest.description());
    event.setMinAge(updateEventRequest.minAge());
    event.setMaxAge(updateEventRequest.maxAge());
    event.setExperienceLevel(updateEventRequest.experienceLevel());
    event.setMaxParticipants(updateEventRequest.maxParticipants());
    event.setCity(updateEventRequest.city());
    event.setAddress(updateEventRequest.address());

    return eventRepository.save(event);
  }

  @CacheEvict(value = "eventsCache", allEntries = true)
  public void deleteEvent(long eventId, Principal principal) {
    Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new EventNotFoundException("Event with ID " + eventId + " not found"));

    if (principal instanceof Authentication) {
      Authentication auth = (Authentication) principal;
    }

    User currentUser = userRepository.findByUsername(principal.getName())
            .orElseThrow(() -> new UsernameNotFoundException("User " + principal.getName() + " not found"));

    boolean isAdmin = false;

    if (principal instanceof Authentication) {
      Authentication auth = (Authentication) principal;
      isAdmin = auth.getAuthorities().stream()
              .anyMatch(a -> a.getAuthority().contains("ADMIN"));
    }

    if (!isAdmin) {
      isAdmin = currentUser.getRoles()
              .stream()
              .anyMatch(role -> role.getName().equalsIgnoreCase("ADMIN"));
    }

    boolean isEventOwner = event.getOrganizer() != null &&
            event.getOrganizer().getUsername().equals(currentUser.getUsername());

    if (isAdmin || isEventOwner) {
      eventRepository.delete(event);
    } else {
      throw new ForbiddenException("You do not have permission to delete this event");
    }
  }

  @Cacheable("eventsCache")
  public List<EventResponse> getUserEvents(long userId) {

    User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User " + userId + " not found"));

    List<Event> events = eventRepository.findByOrganizer(user);

    return events.stream()
            .map(eventMapper::toEventResponse)
            .toList();
  }

  @Cacheable(value = "eventsCache")
  public EventResponse getEventById(long eventId) {
    Event event = eventRepository.findById(eventId).orElseThrow(() -> new EventNotFoundException("Event with ID " + eventId + " not found"));
    return eventMapper.toEventResponse(event);
  }

  @Cacheable("eventsCache")
  public List<GetEventResponse> getAllEvents() {
    return eventRepository.findAll().stream()
            .map(eventMapper::toGetEventResponse)
            .toList();
  }

  @Cacheable("eventsCache")
  public Page<EventResponse> findEventsByFilters(String categoryName, String city, String startDateTime,
                                                 String endDateTime, String experienceLevel,
                                                 Integer minAge, Integer maxAge, String searchTerm, Pageable pageable) {

    if (categoryName != null && !categoryName.isEmpty()) {
      categoryRepository.findByName(categoryName)
              .orElseThrow(() -> new CategoryNotFoundException("Category '" + categoryName + "' not found"));
    }

    Page<Event> eventPage = eventRepository.findEventsByFilters(categoryName, city, startDateTime, endDateTime,
            experienceLevel, minAge, maxAge, searchTerm, pageable);

    List<EventResponse> eventResponses = eventPage.getContent().stream()
            .map(eventMapper::toEventResponse)
            .toList();

    return new PageImpl<>(eventResponses, pageable, eventPage.getTotalElements());
  }


  public Event findEventById(Long eventId) {
    return eventRepository.findById(eventId)
            .orElseThrow(() -> new EventNotFoundException("Event with ID " + eventId + " not found"));
  }

  public Event findById(long id) {
    return eventRepository.findById(id).orElse(null);
  }

//   public EventPictureResponse getEventPicture(long eventId) {
//     EventImage eventImage = eventRepository.findById(eventId).orElseThrow(() -> new EventNotFoundException("Event was not found: " + eventId + " (id)")).getEventImage();
//     return new EventPictureResponse(
//             eventImage.getData(),
//             eventImage.getContentType()
//     );
//   }

  // Events that will start in less than 24 hours
  @Cacheable("eventsCache")
  public List<GetEventResponse> findHotEvents() {
    List<Event> allEvents = eventRepository.findAll();
    List<GetEventResponse> sortedEvents = new ArrayList<>();

    LocalDateTime currentTime = LocalDateTime.now();
    LocalDateTime futureTime = currentTime.plusHours(24);

    for (Event event : allEvents) {
      LocalDateTime startTime = event.getStartDateTime();

      boolean isHot = startTime.isBefore(futureTime) && startTime.isAfter(currentTime);

      if (isHot) {
        sortedEvents.add(eventMapper.toGetEventResponse(event));
      }
    }

    return sortedEvents;
  }

  @Cacheable("eventsCache")
  public List<GetEventResponse> findEventsInUpcoming14Days() {
    // weight constants for calculating scores
    final double WEIGHT_DATE = 3.0;
    final double WEIGHT_HOST = 2.0;
    final double WEIGHT_RESERVATION = 0.5;

    final double MAX_SCORE_PER_FACTOR = 100.0;

    // at least 80% reserved
    final double RESERVATION_THRESHOLD = 0.8;

    // upcoming count is max 14 days old
    final double DATE_SCORE_DECAY_DAYS = 14.0;

    List<Event> upcomingEvents = eventRepository.findByStartDateTimeBetween(
            LocalDateTime.now().plusHours(1),
            LocalDateTime.now().plusDays((long) DATE_SCORE_DECAY_DAYS)
    );

    List<Long> eventIds = upcomingEvents.stream().map(Event::getId).toList();
    Map<Long, Long> registrationCounts = registrationToEventRepository.findCountsByEventIds(eventIds)
            .stream()
            .collect(Collectors.toMap(
                    array -> (Long) array[0],
                    array -> (Long) array[1]
            ));

    PriorityQueue<EventWithScore> topEvents = new PriorityQueue<>(
            10, Comparator.comparingDouble(EventWithScore::score)
    );
    for (Event event : upcomingEvents) {
      // get scores for dates
      Duration timeUntilEvent = Duration.between(LocalDateTime.now(), event.getStartDateTime());
      double dateFactor = Math.max(0.0, 1.0 - (timeUntilEvent.toHours()) / (DATE_SCORE_DECAY_DAYS * 24) / 24);
      double dateScore = dateFactor * MAX_SCORE_PER_FACTOR;

      // TODO: Uncomment and implement when ratings are available
      //       double averageRating = ratingRepository.findAverageRating(event.getOrganizer());
      //       hostScore = (averageRating / 5.0) * MAX_SCORE_PER_FACTOR; // Assuming 5-point scale

      // get scores for reservations
      double reservationPercentage = (double) registrationToEventRepository.countByEventId(event.getId()) / event.getMaxParticipants();
      double reservationScore = reservationPercentage > RESERVATION_THRESHOLD
              ? MAX_SCORE_PER_FACTOR : 0;

      // double totalScore = WEIGHT_DATE * dateScore + WEIGHT_RESERVATION * reservationScore ;
      double totalScore = WEIGHT_DATE * dateScore + WEIGHT_RESERVATION * reservationScore;

      EventWithScore eventWithScore = new EventWithScore(event, totalScore);
      if (topEvents.size() < 10) {
        topEvents.offer(eventWithScore);
      } else if (totalScore > topEvents.peek().score()) {
        topEvents.poll();
        topEvents.offer(eventWithScore);
      }
    }

    return topEvents.stream()
            .sorted(Comparator.comparingDouble(EventWithScore::score).reversed())
            .map(eventWithScore -> eventMapper.toGetEventResponse(eventWithScore.event()))
            .toList();
  }

  @Cacheable("eventsCache")
  public List<GetEventResponse> findRecommendedEvents(String username) {
    User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User " + username + " not found"));

    // weight constants for calculating scores
    final double WEIGHT_CITY_MATCH = 3.0;
    final double WEIGHT_CATEGORY_MATCH = 2.5;
    final double WEIGHT_RESERVATION = 1.0;
    // TODO: add WEIGHT for popularity

    // 2/3 reservation
    final double RESERVATION_THRESHOLD = 0.66;

    final double MAX_SCORE_PER_FACTOR = 100.0;

    Integer age = user.getBirthDate() != null ? Period.between(user.getBirthDate(), LocalDate.now()).getYears() : null;
    List<Event> recommendedEvents = eventRepository.findRecommendedEvents(
            age,
            user.getCity(),
            LocalDateTime.now());

    List<Long> eventIds = recommendedEvents.stream().map(Event::getId).toList();
    Map<Long, Long> registrationCounts = registrationToEventRepository.findCountsByEventIds(eventIds)
            .stream().collect(Collectors.toMap(
                    array -> (Long) array[0],
                    array -> (Long) array[1]
            ));

    PriorityQueue<EventWithScore> topEvents = new PriorityQueue<>(
            10, Comparator.comparingDouble(EventWithScore::score));


    Set<Category> favoriteCategories = user.getFavoriteEventCategories();

    for (Event event : recommendedEvents) {
      // get scores for dates

      // TODO: when there is an API for location, add distance calculation instead
      double cityScore = user.getCity() != null && event.getCity().equals(user.getCity())
              ? MAX_SCORE_PER_FACTOR : 0;

      // TODO: when organizers have ratings, it must be included in the scoring system
      //      or better evaluate popularity of event (somehow)
      //      double averageRating = ratingRepository.findAverageRating(upcomingEvent.getOrganizer());

      Long count = registrationCounts.getOrDefault(event.getId(), 0L);
      // get scores for reservations
      double reservationPercentage = (double) count / event.getMaxParticipants();

      double reservationScore = reservationPercentage > RESERVATION_THRESHOLD
              ? MAX_SCORE_PER_FACTOR : 0;

      // get scores for matching category
      double categoryScore = favoriteCategories.contains(event.getCategory())
              ? MAX_SCORE_PER_FACTOR : 0;

      // calculates by multiplying: weights * score
      double totalScore = WEIGHT_CITY_MATCH * cityScore + WEIGHT_RESERVATION * reservationScore + WEIGHT_CATEGORY_MATCH * categoryScore;

      EventWithScore eventWithScore = new EventWithScore(event, totalScore);
      if (topEvents.size() < 10) {
        topEvents.offer(eventWithScore);
      } else if (totalScore > topEvents.peek().score()) {
        topEvents.poll();
        topEvents.offer(eventWithScore);
      }
    }

    return topEvents.stream()
            .sorted(Comparator.comparingDouble(EventWithScore::score).reversed())
            .map(eventWithScore -> eventMapper.toGetEventResponse(eventWithScore.event()))
            .toList();
  }

  public List<EventMapResponse> findAllEventsForMap(String categoryName, String city, String startDateTime,
                                                    String endDateTime, String experienceLevel,
                                                    Integer minAge, Integer maxAge, String searchTerm) {

    if (categoryName != null && !categoryName.isEmpty()) {

      categoryRepository.findByName(categoryName)
              .orElseThrow(() -> new CategoryNotFoundException("Category '" + categoryName + "' not found"));
    }

    List<EventMapSummary> events = eventRepository.findAllEventsForMap(categoryName, city, startDateTime, endDateTime,
            experienceLevel, minAge, maxAge, searchTerm);

    return events.stream()
            .map(eventMapper::toEventMapResponse)
            .toList();
  }

  public List<EventMapResponse> findAllEventsForMapByCreator(Long creatorId, String categoryName, String city,
                                                             String startDateTime, String endDateTime,
                                                             String experienceLevel, Integer minAge,
                                                             Integer maxAge, String searchTerm) {

    userRepository.findById(creatorId)
            .orElseThrow(() -> new UserNotFoundException("User with ID " + creatorId + " not found"));

    if (categoryName != null && !categoryName.isEmpty()) {
      categoryRepository.findByName(categoryName)
              .orElseThrow(() -> new CategoryNotFoundException("Category '" + categoryName + "' not found"));
    }

    List<EventMapSummary> events = eventRepository.findAllEventsForMapByCreator(
            creatorId, categoryName, city, startDateTime, endDateTime,
            experienceLevel, minAge, maxAge, searchTerm);

    return events.stream()
            .map(eventMapper::toEventMapResponse)
            .toList();
  }

  public Page<EventSummaryResponse> getUserCreatedEvents(Long userId, Pageable pageable) {

    userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User with ID " + userId + " not found"));

    Page<Event> eventPage = eventRepository.findEventsByOrganizer(userId, pageable);

    return eventPage.map(eventMapper::toEventSummaryResponse);
  }

  public Page<EventSummaryResponse> getUserRegisteredEvents(Long userId, Pageable pageable) {

    userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User with ID " + userId + " not found"));

    Page<Event> eventPage = eventRepository.findEventsByParticipant(userId, pageable);

    return eventPage.map(eventMapper::toEventSummaryResponse);
  }

  public String findImageKeyById(Long eventId) {
    return eventRepository.findImageKeyById(eventId);
  }
}
