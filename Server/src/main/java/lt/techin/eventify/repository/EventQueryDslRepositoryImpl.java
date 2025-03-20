package lt.techin.eventify.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lt.techin.eventify.model.Category;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.QEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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

  public Page<Event> findEventsByFilters(String categoryName, String city, LocalDateTime startDateTime,
                                         LocalDateTime endDateTime, String experienceLevel,
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
      builder.and(event.city.eq(city));
    }

    LocalDateTime now = LocalDateTime.now();
    if (startDateTime != null) {
      builder.and(event.startDateTime.goe(startDateTime));
    } else {
      builder.and(event.startDateTime.goe(now));
    }

    if (endDateTime != null) {
      builder.and(event.endDateTime.loe(endDateTime));
    }

    if (experienceLevel != null && !experienceLevel.isEmpty()) {
      builder.and(event.experienceLevel.equalsIgnoreCase(experienceLevel));
    }

    if (minAge != null) {
      builder.and(event.minAge.loe(minAge));
    }

    if (maxAge != null) {
      builder.and(event.maxAge.goe(maxAge));
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
        case "experienceLevel":
          orderSpecifiers.add(new OrderSpecifier<>(direction, event.experienceLevel));
          break;
        default:
          orderSpecifiers.add(new OrderSpecifier<>(Order.ASC, event.startDateTime));
          break;
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
}