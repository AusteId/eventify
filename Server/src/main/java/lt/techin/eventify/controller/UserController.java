package lt.techin.eventify.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lt.techin.eventify.dto.user.CreateUserRequest;
import lt.techin.eventify.dto.user.UserMapper;
import lt.techin.eventify.dto.user.UserResponse;
import lt.techin.eventify.model.User;
import lt.techin.eventify.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

  private final UserService userService;
  private final UserMapper userMapper;

  public UserController(UserService userService, UserMapper userMapper) {
    this.userService = userService;
    this.userMapper = userMapper;
  }

  @PostMapping(value = "/register",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
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
}
