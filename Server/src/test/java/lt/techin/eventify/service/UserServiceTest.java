package lt.techin.eventify.service;

import lt.techin.eventify.dto.user.LoginUserRequest;
import lt.techin.eventify.exception.InvalidCredentialsException;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.mysql.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

  @Mock
  private UserRepository userRepository;

  @Mock
  private PasswordEncoder passwordEncoder;

  @Mock
  private TokenService tokenService;

  @InjectMocks
  private UserService userService;

  private User user;
  private LoginUserRequest loginRequest;

  @BeforeEach
  void setUp() {

    user = new User(
            "testuser",
            "user@user.com",
            "$2a$10$hashedPassword",
            null,
            null,
            null,
            new HashSet<>(),
            new HashSet<>()
    );

    loginRequest = new LoginUserRequest("user@user.com", "User1234", false);
  }

  @Test
  void loginUser_ValidCredentials_ReturnsToken() {

    when(userRepository.findByEmail("user@user.com")).thenReturn(Optional.of(user));
    when(passwordEncoder.matches("User1234", user.getPassword())).thenReturn(true);

    String expectedToken = "jwt.token.example";
    when(tokenService.generateToken(user, false)).thenReturn(expectedToken);

    String actualToken = userService.loginUser(loginRequest);

    assertEquals(expectedToken, actualToken);

    verify(userRepository).findByEmail("user@user.com");
    verify(passwordEncoder).matches("User1234", user.getPassword());
    verify(tokenService).generateToken(user, false);
  }

  @Test
  void loginUser_InvalidCredentials_ThrowsException() {

    when(userRepository.findByEmail("wrong@example.com")).thenReturn(Optional.empty());

    LoginUserRequest wrongEmailRequest = new LoginUserRequest("wrong@example.com", "User1234", false);

    InvalidCredentialsException exception = assertThrows(InvalidCredentialsException.class, () -> {
      userService.loginUser(wrongEmailRequest);
    });
    assertEquals("Invalid email or password", exception.getMessage());

    when(userRepository.findByEmail("user@user.com")).thenReturn(Optional.of(user));
    when(passwordEncoder.matches("wrongPassword", user.getPassword())).thenReturn(false);

    LoginUserRequest wrongPasswordRequest = new LoginUserRequest("user@user.com", "wrongPassword", false);

    exception = assertThrows(InvalidCredentialsException.class, () -> {
      userService.loginUser(wrongPasswordRequest);
    });
    assertEquals("Invalid email or password", exception.getMessage());

    verify(userRepository).findByEmail("wrong@example.com");
    verify(userRepository).findByEmail("user@user.com");
    verify(passwordEncoder).matches("wrongPassword", user.getPassword());
  }

  @Test
  void loginUser_EmptyFields_ThrowsException() {

    LoginUserRequest nullEmailRequest = new LoginUserRequest(null, "User1234", false);

    InvalidCredentialsException exception = assertThrows(InvalidCredentialsException.class, () -> {
      userService.loginUser(nullEmailRequest);
    });
    assertEquals("Invalid email or password", exception.getMessage());

    LoginUserRequest nullPasswordRequest = new LoginUserRequest("user@user.com", null, false);

    exception = assertThrows(InvalidCredentialsException.class, () -> {
      userService.loginUser(nullPasswordRequest);
    });
    assertEquals("Invalid email or password", exception.getMessage());
  }
}