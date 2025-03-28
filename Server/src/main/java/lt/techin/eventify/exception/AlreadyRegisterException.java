package lt.techin.eventify.exception;

public class AlreadyRegisterException extends RuntimeException {
    public AlreadyRegisterException(String message) {
        super(message);
    }
}
