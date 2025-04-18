package lt.techin.eventify.service;

import lt.techin.eventify.model.Role;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.mysql.UserRepository;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.stream.Collectors;

@Service
public class TokenService {
  private final JwtEncoder jwtEncoder;
  private final UserRepository userRepository;

  public TokenService(JwtEncoder jwtEncoder, UserRepository userRepository) {
    this.jwtEncoder = jwtEncoder;
    this.userRepository = userRepository;
  }

  public String generateToken(User user,boolean rememberMe) {
    Instant now = Instant.now();

    long expiry = rememberMe ? 2592000L : 86400L;

    String scope = user.getRoles().stream().map(Role::getName).collect(Collectors.joining(" "));

    JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("self")
            .issuedAt(now)
            .expiresAt(now.plusSeconds(expiry))
            .subject(user.getUsername())
            .claim("scope", scope)
            .claim("userId", user.getId())
            .build();

    return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
  }

  public String generateToken(User user) {
    return generateToken(user,false);
  }

}