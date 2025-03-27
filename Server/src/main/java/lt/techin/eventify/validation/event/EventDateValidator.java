package lt.techin.eventify.validation.event;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lt.techin.eventify.dto.event.CreateEventRequest;

public class EventDateValidator implements ConstraintValidator<ValidEventDates, CreateEventRequest> {

  @Override
  public boolean isValid(CreateEventRequest createEventRequest, ConstraintValidatorContext constraintValidatorContext) {

    if (createEventRequest.startDateTime() == null || createEventRequest.endDateTime() == null) {
      return true;
    }
    return createEventRequest.endDateTime().isAfter(createEventRequest.startDateTime());
  }
}
