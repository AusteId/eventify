package lt.techin.eventify.controller;

import jakarta.validation.Valid;
import lt.techin.eventify.dto.user.*;
import lt.techin.eventify.dto.event.EventResponse;
import lt.techin.eventify.dto.user.CreateUserRequest;
import lt.techin.eventify.dto.user.LoginUserRequest;
import lt.techin.eventify.dto.user.UserMapper;
import lt.techin.eventify.dto.user.UserResponse;
import lt.techin.eventify.model.User;
import lt.techin.eventify.service.EventService;
import lt.techin.eventify.service.UserService;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.io.IOException;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

  private final UserService userService;
  private final EventService eventService;
  private final UserMapper userMapper;

  @Autowired
  public UserController(UserService userService, EventService eventService, UserMapper userMapper) {
    this.userService = userService;
    this.eventService = eventService;
    this.userMapper = userMapper;
  }

  @GetMapping("/all")
  public ResponseEntity<List<User>> getUsers() {
    return ResponseEntity.ok(userService.findAllUsers());
  }

  @PostMapping("/login")
  public ResponseEntity<?> loginUser(@Valid @RequestBody LoginUserRequest userRequest) {
    String token = userService.loginUser(userRequest);
    ResponseCookie jwtCookie = ResponseCookie.from("jwt_token",token)
            .httpOnly(true)
            .secure(false)
            .sameSite("Strict")
            .maxAge(360000)
            .path("/")
            .build();

    ResponseCookie swaggerCookie = ResponseCookie.from("jwt_token_swagger",token)
            .httpOnly(false)
            .secure(false)
            .sameSite("Strict")
            .maxAge(360000)
            .path("/")
            .build();

    return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE,jwtCookie.toString())
            .header(HttpHeaders.SET_COOKIE, swaggerCookie.toString())
            .body(Map.of("success",true));
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logoutUser() {
    ResponseCookie cookie = ResponseCookie.from("jwt_token","")
            .httpOnly(true)
            .secure(false)
            .maxAge(0)
            .path("/")
            .build();

    ResponseCookie swaggerCookie = ResponseCookie.from("jwt_token_swagger", "")
            .httpOnly(false)
            .secure(false)
            .maxAge(0)
            .path("/")
            .build();


    return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE,cookie.toString())
            .header(HttpHeaders.SET_COOKIE,swaggerCookie.toString())
            .body(Map.of("success",true));
  }

  @GetMapping("/me")
  public ResponseEntity<?> getCurrentUser(Authentication authentication) {
    if (authentication == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    String username = authentication.getName();
    User user = userService.findByUsername(username).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
            "User Not Found"));
    UserResponse userResponse = userMapper.toUserResponse(user);
    return ResponseEntity.ok(userResponse);
  }

  @GetMapping("/check-availability")
  public ResponseEntity<Map<String, Boolean>> checkAvailability(
          @RequestParam(required = false) String username,
          @RequestParam(required = false) String email) {

    Map<String, Boolean> result = new HashMap<>();

    if (username != null && !username.isEmpty()) {
      result.put("usernameExists", userService.existsByUsername(username));
    }

    if (email != null && !email.isEmpty()) {
      result.put("emailExists", userService.existsByEmail(email));
    }

    return ResponseEntity.ok(result);
  }

  @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<UserResponse> addUser(@Valid @ModelAttribute CreateUserRequest dto) {
    try {
      User newUser = userService.saveUser(dto);
      UserResponse savedUser = userMapper.toUserResponse(newUser);

      return ResponseEntity.created(
                      ServletUriComponentsBuilder.fromCurrentRequest()
                              .path("/{id}")
                              .buildAndExpand(savedUser.id())
                              .toUri())
              .body(savedUser);
    } catch (IOException e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }
  }

  @GetMapping("/{userId}/events")
  public ResponseEntity<List<EventResponse>> getUserEvents(@PathVariable long userId) {
    List<EventResponse> events = eventService.getUserEvents(userId);
    return ResponseEntity.ok(events);
  }
  @GetMapping("/avatar")
  public ResponseEntity<byte[]> getUserPrivateAvatar() {
    AvatarResponseDTO avatarResponseDTO = userService.getUserPrivateAvatar();
    return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(avatarResponseDTO.contentType()))
            .body(avatarResponseDTO.data());
  }
}
