package lt.techin.eventify.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Controller
public class WebSocketDebugController {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketDebugController.class);

    @MessageMapping("/debug/ping")
    @SendToUser("/queue/debug")
    public Map<String, Object> debugPing(Principal principal) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "WebSocket connection is working properly");
        response.put("timestamp", LocalDateTime.now().toString());

        logger.debug("Debug ping received from: {}",
                principal != null ? principal.getName() : "anonymous");

        if (principal != null) {
            response.put("authenticatedAs", principal.getName());
            response.put("authenticated", true);
        } else {
            response.put("authenticated", false);
        }

        return response;
    }

    @MessageMapping("/debug/echo")
    @SendTo("/topic/debug/echo")
    public Map<String, Object> echo(Map<String, Object> message, Authentication authentication) {
        Map<String, Object> response = new HashMap<>(message);
        response.put("receivedTimestamp", LocalDateTime.now().toString());

        logger.debug("Debug echo received: {} from: {}",
                message, authentication != null ? authentication.getName() : "anonymous");

        if (authentication != null) {
            response.put("authenticatedAs", authentication.getName());
            response.put("authenticated", true);
        } else {
            response.put("authenticated", false);
        }

        return response;
    }

    @MessageMapping("/debug/auth")
    @SendToUser("/queue/debug/auth")
    public Map<String, Object> checkAuth(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now().toString());

        if (authentication != null) {
            logger.debug("Debug auth check: User {} is authenticated", authentication.getName());
            response.put("authenticated", true);
            response.put("username", authentication.getName());
            response.put("authorities", authentication.getAuthorities().toString());
        } else {
            logger.debug("Debug auth check: No authentication found");
            response.put("authenticated", false);
        }

        return response;
    }
}
