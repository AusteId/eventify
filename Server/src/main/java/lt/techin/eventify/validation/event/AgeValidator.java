package lt.techin.eventify.validation.event;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lt.techin.eventify.dto.event.CreateEventRequest;

public class AgeValidator implements ConstraintValidator<ValidAgeRange, CreateEventRequest> {

  @Override
  public boolean isValid(CreateEventRequest createEventRequest, ConstraintValidatorContext constraintValidatorContext) {

    if (createEventRequest == null || createEventRequest.minAge() == null || createEventRequest.maxAge() == null) {
      return true;
    }
    return createEventRequest.minAge() <= createEventRequest.maxAge();
  }
}
