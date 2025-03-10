package lt.techin.eventify.controller;

import jakarta.validation.Valid;
import lt.techin.eventify.dto.user.CreateUserRequest;
import lt.techin.eventify.dto.user.LoginUserRequest;
import lt.techin.eventify.dto.user.UserMapper;
import lt.techin.eventify.dto.user.UserResponse;
import lt.techin.eventify.model.User;
import lt.techin.eventify.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

  private final UserService userService;
  private final UserMapper userMapper;

  @Autowired
  public UserController(UserService userService, UserMapper userMapper) {
    this.userService = userService;
    this.userMapper = userMapper;
  }

  @PostMapping("/register")
  public ResponseEntity<UserResponse> addUser(@Valid @RequestBody CreateUserRequest createUserRequest) {
    User newUser = userService.saveUser(createUserRequest);
    UserResponse savedUser = userMapper.toUserResponse(newUser);

    return ResponseEntity.created(
                    ServletUriComponentsBuilder.fromCurrentRequest()
                            .path("/{id}")
                            .buildAndExpand(savedUser.id())
                            .toUri())
            .body(savedUser);
  }

  @GetMapping("/all")
  public ResponseEntity<List<User>> getUsers() {
    return ResponseEntity.ok(userService.findAllUsers());
  }

  @PostMapping("/login")
  public ResponseEntity<Map<String, String>> loginUser(@Valid @RequestBody LoginUserRequest userRequest) {
    return ResponseEntity.ok(Map.of("token", userService.loginUser(userRequest)));
  }
}
