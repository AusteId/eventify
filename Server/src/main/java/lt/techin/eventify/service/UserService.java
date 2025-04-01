package lt.techin.eventify.service;

import lt.techin.eventify.dto.user.AvatarResponseDTO;
import lt.techin.eventify.dto.user.CreateUserRequest;
import lt.techin.eventify.dto.user.LoginUserRequest;
import lt.techin.eventify.dto.user.UserMapper;
import lt.techin.eventify.exception.EmailAlreadyExistsException;
import lt.techin.eventify.exception.InvalidCredentialsException;
import lt.techin.eventify.exception.UsernameAlreadyExistsException;
import lt.techin.eventify.model.Category;
import lt.techin.eventify.model.Role;
import lt.techin.eventify.model.User;
import lt.techin.eventify.model.UserImage;
import lt.techin.eventify.repository.mysql.CategoryRepository;
import lt.techin.eventify.repository.mysql.RoleRepository;
import lt.techin.eventify.repository.mysql.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final UserMapper userMapper;
  private final RoleRepository roleRepository;
  private final CategoryRepository categoryRepository;
  private final TokenService tokenService;

  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper,
                     RoleRepository roleRepository, CategoryRepository categoryRepository, TokenService tokenService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.userMapper = userMapper;
    this.roleRepository = roleRepository;
    this.categoryRepository = categoryRepository;
    this.tokenService = tokenService;
  }

  public boolean existsByUsername(String username) {
    return userRepository.existsByUsername(username);
  }

  public boolean existsByEmail(String email) {
    return userRepository.existsByEmail(email);
  }

  public User saveUser(CreateUserRequest dto) throws IOException {
    if (userRepository.existsByEmail(dto.email())) {
      throw new EmailAlreadyExistsException("Email already exists.");
    }

    if (userRepository.existsByUsername(dto.username())) {
      throw new UsernameAlreadyExistsException("Username already exists.");
    }

    Role roleUser = roleRepository.findByName("USER").orElseThrow();

    User newUser = userMapper.toUser(dto);


    Set<Category> favoriteCategories = new HashSet<>();
    if (dto.categoryIds() != null && !dto.categoryIds().isEmpty()) {
      favoriteCategories = dto.categoryIds().stream()
              .map(categoryId -> categoryRepository.findById(categoryId)
                      .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId)))
              .collect(Collectors.toSet());
    }

    newUser.setFavoriteEventCategories(favoriteCategories);

    UserImage avatar = UserMapper.imageToEntity(dto);

    newUser.setAvatar(avatar);
    newUser.setPassword(passwordEncoder.encode(dto.password()));
    newUser.setRoles(Set.of(roleUser));

    return userRepository.save(newUser);
  }

    public User findById(long id) {
        return userRepository.findById(id).orElseThrow(NullPointerException::new);
    }

  public Optional<User> findByUsername(String name) {
    return userRepository.findByUsername(name);
  }

  public List<User> findAllUsers() {
    return userRepository.findAll();
  }

  public String loginUser(LoginUserRequest loginUserRequest) {
    Optional<User> user = userRepository.findByEmail(loginUserRequest.email());

    if (user.isEmpty()) {
      throw new InvalidCredentialsException("Invalid email or password");
    }

    if (!passwordEncoder.matches(loginUserRequest.password(), user.get().getPassword())) {
      throw new InvalidCredentialsException("Invalid email or password");
    }

    return tokenService.generateToken(user.get());
  }

  public AvatarResponseDTO getUserPrivateAvatar() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User user = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    return new AvatarResponseDTO(
            user.getAvatar().getData(),
            user.getAvatar().getContentType()
    );
  }
}
