package lt.techin.eventify.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lt.techin.eventify.model.Category;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.QEvent;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class EventQueryDslRepository {

    private final JPAQueryFactory queryFactory;
    private final CategoryRepository categoryRepository;

    public EventQueryDslRepository(JPAQueryFactory queryFactory, CategoryRepository categoryRepository) {
        this.queryFactory = queryFactory;
        this.categoryRepository = categoryRepository;
    }

    public List<Event> findEventsByFilters(String categoryName, String city, LocalDateTime startDateTime,
                                           LocalDateTime endDateTime, String experienceLevel,
                                           Integer minAge, Integer maxAge) {

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
            builder.and(event.city.eq(city));
        }

        if (startDateTime != null) {
            builder.and(event.startDateTime.goe(startDateTime));
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

        return queryFactory.selectFrom(event)
                .where(builder)
                .fetch();
    }
}