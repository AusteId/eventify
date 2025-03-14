package lt.techin.eventify.validation.ConsistentDateRangeValidation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lt.techin.eventify.dto.event.CreateEventRequest;

public class ConsistentDateRangeValidator implements ConstraintValidator<ConsistentDateRange, CreateEventRequest> {


  @Override
  public boolean isValid(CreateEventRequest request, ConstraintValidatorContext context) {
    // no validation needed if endDate is null
    if (request.endDateTime() == null) {
      return true;
    }
    return request.endDateTime().isAfter(request.startDateTime());
  }
}
