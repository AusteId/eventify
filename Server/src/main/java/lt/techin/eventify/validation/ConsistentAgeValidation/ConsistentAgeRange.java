package lt.techin.eventify.validation.ConsistentAgeValidation;

import jakarta.validation.Constraint;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = ConsistentAgeRangeValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ConsistentAgeRange {
  String message() default "End date must be after start date";

  Class<?>[] groups() default {};

  Class<?>[] payload() default {};
}
