package lt.techin.eventify.exception;

public class AutocompleteException extends RuntimeException {

  public AutocompleteException(String message) {
    super(message);
  }

  public AutocompleteException(String message, Throwable cause) {
    super(message, cause);
  }
}
