package lt.techin.eventify.dto.userStatus;

public class TypingStatusRequest {
    private String conversationId;
    private boolean isTyping;

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

    public void setIsTyping(boolean isTyping) {
        this.isTyping = isTyping;
    }

    @Override
    public String toString() {
        return "TypingStatusRequest{" +
                "conversationId='" + conversationId + '\'' +
                ", isTyping=" + isTyping +
                '}';
    }
}
