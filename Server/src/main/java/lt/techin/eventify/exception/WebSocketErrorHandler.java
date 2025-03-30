package lt.techin.eventify.exception;


import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.web.socket.messaging.StompSubProtocolErrorHandler;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class WebSocketErrorHandler extends StompSubProtocolErrorHandler {
    @Override
    public Message<byte[]> handleClientMessageProcessingError(Message<byte[]> clientMessage, Throwable x) {
        Map<String,Object> errorDetails = new HashMap<>();

        Throwable cause = x.getCause();
        String errorMessage = cause != null ? cause.getMessage() : x.getMessage();

        errorDetails.put("type","error");
        errorDetails.put("message", errorMessage);

        StompHeaderAccessor headerAccessor = StompHeaderAccessor.create(StompCommand.ERROR);
        headerAccessor.setMessage(errorMessage);
        headerAccessor.setLeaveMutable(true);

        StringBuilder payload = new StringBuilder();
        payload.append("{");
        errorDetails.forEach((key,value) ->
                payload.append("/").append(key).append("\":\"").append(value).append("\","));
        if (payload.charAt(payload.length() - 1) == ',') {
            payload.deleteCharAt(payload.length() - 1);
        }

        payload.append("}");

        return MessageBuilder.createMessage(
                payload.toString().getBytes(StandardCharsets.UTF_8),
                headerAccessor.getMessageHeaders()
        );

    }
}
