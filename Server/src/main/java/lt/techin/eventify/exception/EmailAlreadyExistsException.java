package lt.techin.eventify.exception;

public class EmailAlreadyExistsException extends AlreadyExistsException {
  public EmailAlreadyExistsException(String message) {
    super(message);
  }
}
