package lt.techin.eventify.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketAuthInterceptor.class);

    private final JwtDecoder jwtDecoder;
    private final JwtAuthenticationConverter jwtAuthenticationConverter;

    public WebSocketAuthInterceptor(JwtDecoder jwtDecoder, JwtAuthenticationConverter jwtAuthenticationConverter) {
        this.jwtDecoder = jwtDecoder;
        this.jwtAuthenticationConverter = jwtAuthenticationConverter;
        logger.info("WebSocketAuthInterceptor initialized");
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) {
            logger.warn("StompHeaderAccessor is null");
            return message;
        }

        logger.debug("Processing WebSocket message of type: {}", accessor.getCommand());

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            logger.info("Processing CONNECT command");

            try {
                List<String> authHeaders = accessor.getNativeHeader("Authorization");

                if (authHeaders == null || authHeaders.isEmpty()) {
                    logger.warn("No Authorization header found");
                    String sessionId = accessor.getSessionId();
                    logger.info("Session ID: {}", sessionId);
                    return message;
                }

                String authHeader = authHeaders.get(0);
                if (!authHeader.startsWith("Bearer ")) {
                    logger.warn("Authorization header does not start with 'Bearer '");
                    return message;
                }

                String token = authHeader.substring("Bearer ".length());
                logger.debug("JWT token found: {}", token.substring(0, Math.min(10, token.length())) + "...");

                try {
                    Jwt jwt = jwtDecoder.decode(token);
                    logger.info("JWT decoded successfully, subject: {}", jwt.getSubject());

                    AbstractAuthenticationToken authentication = jwtAuthenticationConverter.convert(jwt);
                    accessor.setUser(authentication);
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    logger.info("WebSocket authenticated for user: {}", authentication.getName());
                } catch (JwtException e) {
                    logger.error("JWT authentication failed: {}", e.getMessage());
                }
            } catch (Exception e) {
                logger.error("Error during WebSocket authentication", e);
            }
        }

        return message;
    }
}