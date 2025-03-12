package lt.techin.eventify.service;

import lt.techin.eventify.dto.user.CreateUserRequest;
import lt.techin.eventify.dto.user.UserMapper;
import lt.techin.eventify.exception.EmailAlreadyExistsException;
import lt.techin.eventify.exception.UsernameAlreadyExistsException;
import lt.techin.eventify.model.Category;
import lt.techin.eventify.model.Role;
import lt.techin.eventify.model.User;
import lt.techin.eventify.model.UserImage;
import lt.techin.eventify.repository.CategoryRepository;
import lt.techin.eventify.repository.RoleRepository;
import lt.techin.eventify.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;
    private final CategoryRepository categoryRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper,
                       RoleRepository roleRepository,CategoryRepository categoryRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.roleRepository = roleRepository;
        this.categoryRepository = categoryRepository;
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User saveUser(CreateUserRequest dto) throws IOException {

        if(userRepository.existsByEmail(dto.email())) {
            throw new EmailAlreadyExistsException("Email already exists.");
        }

        if(userRepository.existsByUsername(dto.username())) {
            throw new UsernameAlreadyExistsException("Username already exists.");
        }

        Role roleUser = roleRepository.findByName("USER").orElseThrow();

        User newUser = userMapper.toUser(dto);

        if (newUser.getBirthDate() == null) {
            newUser.setBirthDate(LocalDate.EPOCH);
        }

        if (newUser.getDescription() == null) {
            newUser.setDescription("No description yet");
        }

        if (newUser.getCity() == null) {
            newUser.setCity("No city provided");
        }

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
        newUser.setRegisteredAt(LocalDateTime.now());
        newUser.setRoles(Set.of(roleUser));

        return userRepository.save(newUser);
    }
}
