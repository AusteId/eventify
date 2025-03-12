package lt.techin.eventify.validation.ConsistentAgeValidation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lt.techin.eventify.dto.event.CreateEventRequest;

public class ConsistentAgeRangeValidator implements ConstraintValidator<ConsistentAgeRange, CreateEventRequest> {
  @Override
  public boolean isValid(CreateEventRequest request, ConstraintValidatorContext context) {

    if (request.minAge() == null || request.maxAge() == null) {
      return true;
    }
    return request.minAge() < request.maxAge();
  }
}
