package lt.techin.eventify.model;


import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "user_statuses")
public class UserStatus {
    @Id
    private String id;
    private Long userId;
    private OnlineStatus status;
    private boolean isTyping;
    private String typingInConversation;
    private LocalDateTime lastSeen;

    public UserStatus() {

    }

    public String getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public OnlineStatus getStatus() {
        return status;
    }

    public void setStatus(OnlineStatus status) {
        this.status = status;
    }

    public boolean isTyping() {
        return isTyping;
    }

    public void setTyping(boolean typing) {
        isTyping = typing;
    }

    public String getTypingInConversation() {
        return typingInConversation;
    }

    public void setTypingInConversation(String typingInConversation) {
        this.typingInConversation = typingInConversation;
    }

    public LocalDateTime getLastSeen() {
        return lastSeen;
    }

    public void setLastSeen(LocalDateTime lastSeen) {
        this.lastSeen = lastSeen;
    }
}
