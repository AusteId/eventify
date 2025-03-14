package lt.techin.eventify.validation.event;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = AgeValidator.class)
@Target({ElementType.FIELD, ElementType.TYPE, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidAgeRange {
    String message() default "Minimum age cannot be greater than maximum age";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
