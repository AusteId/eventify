package lt.techin.eventify.exception;

public class SelfRatingNotAllowedException extends RuntimeException {
  public SelfRatingNotAllowedException(String message) {
    super(message);
  }
}
