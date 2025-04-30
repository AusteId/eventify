package lt.techin.eventify.exception;

public class RatingAlreadyExistsException extends RuntimeException {
  public RatingAlreadyExistsException(String message) {
    super(message);
  }
}
