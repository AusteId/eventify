package lt.techin.eventify.dto.userStatus;

// Use a proper class instead of a record for better compatibility
public class TypingStatusRequest {
    private String conversationId;
    private boolean isTyping;

    // Default constructor needed for Jackson deserialization
    public TypingStatusRequest() {
    }

    public TypingStatusRequest(String conversationId, boolean isTyping) {
        this.conversationId = conversationId;
        this.isTyping = isTyping;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public boolean isTyping() {
        return isTyping;
    }

    public void setTyping(boolean typing) {
        this.isTyping = typing;
    }

    @Override
    public String toString() {
        return "TypingStatusRequest{" +
                "conversationId='" + conversationId + '\'' +
                ", isTyping=" + isTyping +
                '}';
    }
}
