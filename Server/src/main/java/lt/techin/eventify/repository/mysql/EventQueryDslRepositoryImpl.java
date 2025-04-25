package lt.techin.eventify.repository.mysql;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lt.techin.eventify.dto.event.EventMapSummary;
import lt.techin.eventify.model.Category;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.QEvent;
import lt.techin.eventify.model.QRegistrationToEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class EventQueryDslRepositoryImpl implements EventQueryDslRepository {

  private final JPAQueryFactory queryFactory;
  private final CategoryRepository categoryRepository;

  public EventQueryDslRepositoryImpl(JPAQueryFactory queryFactory, CategoryRepository categoryRepository) {
    this.queryFactory = queryFactory;
    this.categoryRepository = categoryRepository;
  }

  public Page<Event> findEventsByFilters(String categoryName, String city, String startDateTime,
                                         String endDateTime, String experienceLevel,
                                         Integer minAge, Integer maxAge, String searchTerm, Pageable pageable) {

    QEvent event = QEvent.event;
    BooleanBuilder builder = new BooleanBuilder();

    if (categoryName != null && !categoryName.isEmpty()) {

      Optional<Category> categoryOptional = categoryRepository.findByName(categoryName);

      if (categoryOptional.isEmpty()) {
        return new PageImpl<>(new ArrayList<>(), pageable, 0);
      }

      categoryOptional.ifPresent(category -> builder.and(event.category.eq(category)));
    }

    if (city != null && !city.isEmpty()) {
      builder.and(event.city.containsIgnoreCase(city));
    }

    LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
    if (startDateTime != null && !startDateTime.isEmpty()) {
      LocalDateTime startOfDay = LocalDate.parse(startDateTime).atStartOfDay();
      builder.and(event.startDateTime.goe(startOfDay));
    } else {
      builder.and(event.startDateTime.goe(now));
    }

    if (endDateTime != null && !endDateTime.isEmpty()) {
      LocalDateTime endOfDay = LocalDate.parse(endDateTime).atTime(23, 59, 59);
      builder.and(event.startDateTime.loe(endOfDay));
    }

    if (experienceLevel != null && !experienceLevel.isEmpty()) {
      builder.and(event.experienceLevel.equalsIgnoreCase(experienceLevel));
    }

    if (minAge != null) {
      builder.and(event.minAge.isNotNull().and(event.minAge.gt(0)).and(event.minAge.goe(minAge)));
    }

    if (maxAge != null) {
      builder.and(event.maxAge.isNotNull().and(event.maxAge.gt(0)).and(event.maxAge.loe(maxAge)));
    }

    if (searchTerm != null && !searchTerm.isEmpty()) {
      builder.andAnyOf(
              event.name.containsIgnoreCase(searchTerm),
              event.description.containsIgnoreCase(searchTerm)
      );
    }

    List<OrderSpecifier<?>> orderSpecifiers = new ArrayList<>();

    for (Sort.Order order : pageable.getSort()) {

      Order direction = order.getDirection().isAscending() ? Order.ASC : Order.DESC;

      if (order.getProperty().equals("experienceLevel")) {

        NumberExpression<Integer> experienceLevelOrder = new CaseBuilder()
                .when(event.experienceLevel.eq("All Welcome")).then(1)
                .when(event.experienceLevel.eq("Beginner")).then(2)
                .when(event.experienceLevel.eq("Intermediate")).then(3)
                .when(event.experienceLevel.eq("Advanced")).then(4)
                .when(event.experienceLevel.eq("Extreme")).then(5)
                .otherwise(6);

        orderSpecifiers.add(new OrderSpecifier<>(direction, experienceLevelOrder));
      } else {

        switch (order.getProperty()) {
          case "startDateTime":
            orderSpecifiers.add(new OrderSpecifier<>(direction, event.startDateTime));
            break;
          case "name":
            orderSpecifiers.add(new OrderSpecifier<>(direction, event.name));
            break;
          case "createdAt":
            orderSpecifiers.add(new OrderSpecifier<>(direction, event.createdAt));
            break;
          default:
            orderSpecifiers.add(new OrderSpecifier<>(Order.ASC, event.startDateTime));
            break;
        }
      }
    }

    long totalNumberOfEvents = queryFactory.selectFrom(event).where(builder).fetchCount();

    List<Event> events = queryFactory.selectFrom(event)
            .where(builder)
            .orderBy(orderSpecifiers.toArray(new OrderSpecifier[0]))
            .offset(pageable.getOffset())
            .limit(pageable.getPageSize())
            .fetch();

    return new PageImpl<>(events, pageable, totalNumberOfEvents);
  }

  @Override
  public List<EventMapSummary> findAllEventsForMap(String categoryName, String city, String startDateTime,
                                                   String endDateTime, String experienceLevel,
                                                   Integer minAge, Integer maxAge, String searchTerm) {

    QEvent event = QEvent.event;
    BooleanBuilder builder = new BooleanBuilder();

    if (categoryName != null && !categoryName.isEmpty()) {
      Optional<Category> categoryOptional = categoryRepository.findByName(categoryName);
      if (categoryOptional.isEmpty()) {
        return new ArrayList<>();
      }
      categoryOptional.ifPresent(category -> builder.and(event.category.eq(category)));
    }

    if (city != null && !city.isEmpty()) {
      builder.and(event.city.containsIgnoreCase(city));
    }

    LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
    if (startDateTime != null && !startDateTime.isEmpty()) {
      LocalDateTime startOfDay = LocalDate.parse(startDateTime).atStartOfDay();
      builder.and(event.startDateTime.goe(startOfDay));
    } else {
      builder.and(event.startDateTime.goe(now));
    }

    if (endDateTime != null && !endDateTime.isEmpty()) {
      LocalDateTime endOfDay = LocalDate.parse(endDateTime).atTime(23, 59, 59);
      builder.and(event.startDateTime.loe(endOfDay));
    }

    if (experienceLevel != null && !experienceLevel.isEmpty()) {
      builder.and(event.experienceLevel.equalsIgnoreCase(experienceLevel));
    }

    if (minAge != null) {
      builder.and(event.minAge.isNotNull().and(event.minAge.gt(0)).and(event.minAge.goe(minAge)));
    }

    if (maxAge != null) {
      builder.and(event.maxAge.isNotNull().and(event.maxAge.gt(0)).and(event.maxAge.loe(maxAge)));
    }

    if (searchTerm != null && !searchTerm.isEmpty()) {
      builder.andAnyOf(
              event.name.containsIgnoreCase(searchTerm),
              event.description.containsIgnoreCase(searchTerm)
      );
    }

    OrderSpecifier<?> orderSpecifier = new OrderSpecifier<>(Order.ASC, event.startDateTime);

    return queryFactory
            .select(Projections.constructor(EventMapSummary.class,
                    event.id,
                    event.name,
                    event.city,
                    event.address,
                    event.location,
                    event.startDateTime))
            .from(event)
            .where(builder)
            .orderBy(orderSpecifier)
            .fetch();
  }

  @Override
  public Page<Event> findEventsByOrganizer(Long userId, Pageable pageable) {

    QEvent event = QEvent.event;
    BooleanBuilder builder = new BooleanBuilder();

    builder.and(event.organizer.id.eq(userId));
    LocalDateTime now = LocalDateTime.now();
    List<OrderSpecifier<?>> orderSpecifiers = new ArrayList<>();
    BooleanExpression isEndedExpression = event.endDateTime.lt(now).or(event.endDateTime.isNull());
    OrderSpecifier<?> isEndedOrder = new OrderSpecifier<>(Order.ASC,
            Expressions.cases()
                    .when(isEndedExpression).then(1)
                    .otherwise(0));

    orderSpecifiers.add(isEndedOrder);

    for (Sort.Order order : pageable.getSort()) {
      Order direction = order.getDirection().isAscending() ? Order.ASC : Order.DESC;
      switch (order.getProperty()) {
        case "startDateTime":
          orderSpecifiers.add(new OrderSpecifier<>(direction, event.startDateTime));
          break;
        case "name":
          orderSpecifiers.add(new OrderSpecifier<>(direction, event.name));
          break;
        case "createdAt":
          orderSpecifiers.add(new OrderSpecifier<>(direction, event.createdAt));
          break;
        default:
          orderSpecifiers.add(new OrderSpecifier<>(Order.ASC, event.startDateTime));
          break;
      }
    }

    long totalNumberOfEvents = queryFactory.selectFrom(event)
            .where(builder)
            .fetchCount();

    List<Event> events = queryFactory.selectFrom(event)
            .where(builder)
            .orderBy(orderSpecifiers.toArray(new OrderSpecifier[0]))
            .offset(pageable.getOffset())
            .limit(pageable.getPageSize())
            .fetch();

    return new PageImpl<>(events, pageable, totalNumberOfEvents);
  }

  @Override
  public Page<Event> findEventsByParticipant(Long userId, Pageable pageable) {

    QEvent event = QEvent.event;
    QRegistrationToEvent registration = QRegistrationToEvent.registrationToEvent;
    BooleanBuilder builder = new BooleanBuilder();

    builder.and(registration.user.id.eq(userId));
    builder.and(registration.event.eq(event));

    LocalDateTime now = LocalDateTime.now();
    List<OrderSpecifier<?>> orderSpecifiers = new ArrayList<>();
    BooleanExpression isEndedExpression = event.endDateTime.lt(now).or(event.endDateTime.isNull());
    OrderSpecifier<?> isEndedOrder = new OrderSpecifier<>(Order.ASC,
            Expressions.cases()
                    .when(isEndedExpression).then(1)
                    .otherwise(0));

    orderSpecifiers.add(isEndedOrder);

    for (Sort.Order order : pageable.getSort()) {
      Order direction = order.getDirection().isAscending() ? Order.ASC : Order.DESC;
      switch (order.getProperty()) {
        case "startDateTime":
          orderSpecifiers.add(new OrderSpecifier<>(direction, event.startDateTime));
          break;
        case "name":
          orderSpecifiers.add(new OrderSpecifier<>(direction, event.name));
          break;
        case "createdAt":
          orderSpecifiers.add(new OrderSpecifier<>(direction, event.createdAt));
          break;
        default:
          orderSpecifiers.add(new OrderSpecifier<>(Order.ASC, event.startDateTime));
          break;
      }
    }

    long totalNumberOfEvents = queryFactory.selectFrom(event)
            .join(registration).on(registration.event.eq(event))
            .where(builder)
            .fetchCount();

    List<Event> events = queryFactory.selectFrom(event)
            .join(registration).on(registration.event.eq(event))
            .where(builder)
            .orderBy(orderSpecifiers.toArray(new OrderSpecifier[0]))
            .offset(pageable.getOffset())
            .limit(pageable.getPageSize())
            .fetch();

    return new PageImpl<>(events, pageable, totalNumberOfEvents);
  }

  @Override
  public List<EventMapSummary> findAllEventsForMapByCreator(Long creatorId, String categoryName, String city,
                                                            String startDateTime, String endDateTime,
                                                            String experienceLevel, Integer minAge,
                                                            Integer maxAge, String searchTerm) {

    QEvent event = QEvent.event;
    BooleanBuilder builder = new BooleanBuilder();

    builder.and(event.organizer.id.eq(creatorId));

    if (categoryName != null && !categoryName.isEmpty()) {
      Optional<Category> categoryOptional = categoryRepository.findByName(categoryName);
      if (categoryOptional.isEmpty()) {
        return new ArrayList<>();
      }
      categoryOptional.ifPresent(category -> builder.and(event.category.eq(category)));
    }

    if (city != null && !city.isEmpty()) {
      builder.and(event.city.containsIgnoreCase(city));
    }

    if (startDateTime != null && !startDateTime.isEmpty()) {
      LocalDateTime startOfDay = LocalDate.parse(startDateTime).atStartOfDay();
      builder.and(event.startDateTime.goe(startOfDay));
    }

    if (endDateTime != null && !endDateTime.isEmpty()) {
      LocalDateTime endOfDay = LocalDate.parse(endDateTime).atTime(23, 59, 59);
      builder.and(event.startDateTime.loe(endOfDay));
    }

    if (experienceLevel != null && !experienceLevel.isEmpty()) {
      builder.and(event.experienceLevel.equalsIgnoreCase(experienceLevel));
    }

    if (minAge != null) {
      builder.and(event.minAge.isNotNull().and(event.minAge.gt(0)).and(event.minAge.goe(minAge)));
    }

    if (maxAge != null) {
      builder.and(event.maxAge.isNotNull().and(event.maxAge.gt(0)).and(event.maxAge.loe(maxAge)));
    }

    if (searchTerm != null && !searchTerm.isEmpty()) {
      builder.andAnyOf(
              event.name.containsIgnoreCase(searchTerm),
              event.description.containsIgnoreCase(searchTerm)
      );
    }

    OrderSpecifier<?> orderSpecifier = new OrderSpecifier<>(Order.ASC, event.startDateTime);

    return queryFactory
            .select(Projections.constructor(EventMapSummary.class,
                    event.id,
                    event.name,
                    event.city,
                    event.address,
                    event.location,
                    event.startDateTime))
            .from(event)
            .where(builder)
            .orderBy(orderSpecifier)
            .fetch();
  }
}