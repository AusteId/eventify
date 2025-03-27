package lt.techin.eventify.exception;

public class UsernameAlreadyExistsException extends AlreadyExistsException {
  public UsernameAlreadyExistsException(String message) {
    super(message);
  }
}
