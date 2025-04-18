package lt.techin.eventify.exception;

public class TeamMemberNotFoundException extends RuntimeException {
    public TeamMemberNotFoundException(String message) {
        super(message);
    }
}
