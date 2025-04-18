package lt.techin.eventify.controller;

import jakarta.validation.Valid;
import lt.techin.eventify.dto.event.EventResponse;
import lt.techin.eventify.dto.user.*;
import lt.techin.eventify.model.User;
import lt.techin.eventify.service.EventService;
import lt.techin.eventify.service.R2Service;
import lt.techin.eventify.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

  private final UserService userService;
  private final EventService eventService;
  private final UserMapper userMapper;
  private final R2Service r2Service;
  private final RestTemplate restTemplate;

  @Value("${geonames.username}")
  private String geonamesUsername;

  @Autowired
  public UserController(R2Service r2Service, UserService userService, EventService eventService,
                        UserMapper userMapper) {
    this.userService = userService;
    this.eventService = eventService;
    this.userMapper = userMapper;
    this.r2Service = r2Service;
    this.restTemplate = new RestTemplate();
  }

  @GetMapping("/all")
  public ResponseEntity<List<UserResponse>> getUsers() {
    List<UserResponse> userResponses = new ArrayList<>();

    for (User user : userService.findAllUsers()) {
      userResponses.add(userMapper.toUserResponse(user));
    }

    return ResponseEntity.ok(userResponses);
  }

  @PostMapping("/login")
  public ResponseEntity<?> loginUser(@Valid @RequestBody LoginUserRequest userRequest) {
    String token = userService.loginUser(userRequest);

    long maxAge = userRequest.rememberMe() ? 2592000 : 86400;

    ResponseCookie jwtCookie = ResponseCookie.from("jwt_token", token)
            .httpOnly(true)
            .secure(false)
            .sameSite("Strict")
            .maxAge(maxAge)
            .path("/")
            .build();

    ResponseCookie swaggerCookie = ResponseCookie.from("jwt_token_swagger", token)
            .httpOnly(false)
            .secure(false)
            .sameSite("Strict")
            .maxAge(maxAge)
            .path("/")
            .build();

    return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
            .header(HttpHeaders.SET_COOKIE, swaggerCookie.toString())
            .body(Map.of("success", true));
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logoutUser() {
    ResponseCookie cookie = ResponseCookie.from("jwt_token", "")
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
            .header(HttpHeaders.SET_COOKIE, cookie.toString())
            .header(HttpHeaders.SET_COOKIE, swaggerCookie.toString())
            .body(Map.of("success", true));
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
    MultipartFile avatar = dto.avatar();
    try {
      User newUser = userService.saveUser(dto);
      assert avatar != null;
      r2Service.uploadUserAvatar(avatar, newUser.getId());
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
    return ResponseEntity.ok(userService.getUserPrivateAvatar());
  }
  @GetMapping("/{userId}/avatar")
  public ResponseEntity<byte[]> getUserPublicAvatar(@PathVariable Long userId) {
    return ResponseEntity.ok(userService.getUserPublicAvatar(userId));
  }

  @GetMapping("/cities")
  public ResponseEntity<?> searchCities(@RequestParam String query) {
    String url = String.format("http://api.geonames.org/searchJSON?name_startsWith=%s&maxRows=10&username=%s&cities=cities1000&lang=lt&country=LT", query,geonamesUsername);
    Object response = restTemplate.getForObject(url, Object.class);
    return ResponseEntity.ok(response);
  }

}
