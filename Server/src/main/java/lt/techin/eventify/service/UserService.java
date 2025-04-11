package lt.techin.eventify.service;

import lt.techin.eventify.dto.user.*;
import lt.techin.eventify.exception.EmailAlreadyExistsException;
import lt.techin.eventify.exception.InvalidCredentialsException;
import lt.techin.eventify.exception.UsernameAlreadyExistsException;
import lt.techin.eventify.model.*;
import lt.techin.eventify.repository.mongodb.MessageRepository;
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
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final UserMapper userMapper;
  private final RoleRepository roleRepository;
  private final CategoryRepository categoryRepository;
  private final TokenService tokenService;
  private final MessageRepository messageRepository;
  private final R2Service r2Service;

  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper,
                     RoleRepository roleRepository, CategoryRepository categoryRepository, TokenService tokenService,
                     MessageRepository messageRepository,R2Service r2Service) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.userMapper = userMapper;
    this.roleRepository = roleRepository;
    this.categoryRepository = categoryRepository;
    this.tokenService = tokenService;
    this.messageRepository = messageRepository;
    this.r2Service = r2Service;
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

  public byte[] getUserPrivateAvatar() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User user = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    return r2Service.downloadUserAvatar(user.getId());
  }

  public byte[] getUserPublicAvatar(Long id) {
    return r2Service.downloadUserAvatar(id);
  }

  public List<UserSearchDTO> searchUsers(String query, Long currentUserId, int limit) {

    return userRepository.findAll().stream()
            .filter(user -> !user.getId().equals(currentUserId))
            .filter(user -> user.getUsername().toLowerCase().contains(query.toLowerCase()))
            .limit(limit)
            .map(user -> new UserSearchDTO(user.getId(), user.getUsername()))
            .collect(Collectors.toList());
  }

  public List<ChatContactDTO> findChatContacts(Long currentUserId, int limit) {

    try {
      List<Message> allUserMessages = messageRepository.findBySenderIdOrRecipientId(currentUserId, currentUserId);

      if (allUserMessages.isEmpty()) {
        return Collections.emptyList();
      }

      Set<Long> contactUserIds = new HashSet<>();
      Map<Long, LocalDateTime> lastInteractionMap = new HashMap<>();

      for (Message message : allUserMessages) {
        Long contactUserId;

        if (message.getSenderId().equals(currentUserId)) {
          contactUserId = message.getRecipientId();
        } else {
          contactUserId = message.getSenderId();
        }

        contactUserIds.add(contactUserId);

        LocalDateTime timestamp = message.getTimestamp();
        if (!lastInteractionMap.containsKey(contactUserId)
                || lastInteractionMap.get(contactUserId).isBefore(timestamp)) {
          lastInteractionMap.put(contactUserId, timestamp);
        }
      }

      List<User> contactUsers = userRepository.findByIdIn(new ArrayList<>(contactUserIds));

      List<ChatContactDTO> result = contactUsers.stream()
              .map(user -> new ChatContactDTO(
                      user.getId(),
                      user.getUsername(),
                      lastInteractionMap.getOrDefault(user.getId(), LocalDateTime.now().minusYears(10))
              ))
              .sorted(Comparator.comparing(ChatContactDTO::lastInteraction).reversed())
              .limit(limit)
              .toList();

      return result;
    } catch (Exception e) {
      return Collections.emptyList();
    }
  }
}
