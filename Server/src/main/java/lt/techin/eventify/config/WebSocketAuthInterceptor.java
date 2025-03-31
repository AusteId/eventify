package lt.techin.eventify.config;

import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.mysql.UserRepository;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {
    private final JwtDecoder jwtDecoder;
    private final UserRepository userRepository;

    public WebSocketAuthInterceptor(JwtDecoder jwtDecoder, UserRepository userRepository) {
        this.jwtDecoder = jwtDecoder;
        this.userRepository = userRepository;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            List<String> authorization = accessor.getNativeHeader("Authorization");

            if (authorization != null && !authorization.isEmpty()) {
                String accessToken = authorization.get(0).replace("Bearer ", "");

                try {
                    Jwt jwt = jwtDecoder.decode(accessToken);
                    String username = jwt.getSubject();

                    User user = userRepository.findByUsername(username)
                            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
                    Authentication auth = new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            user.getAuthorities()
                    );

                    SecurityContextHolder.getContext().setAuthentication(auth);
                    accessor.setUser(auth);
                } catch (Exception e) {
                    return null;
                }
            }
        }

        return message;
    }
}
