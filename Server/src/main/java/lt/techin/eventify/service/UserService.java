package lt.techin.eventify.service;

import lt.techin.eventify.dto.user.CreateUserRequest;
import lt.techin.eventify.dto.user.UserMapper;
import lt.techin.eventify.exception.EmailAlreadyExistsException;
import lt.techin.eventify.exception.UsernameAlreadyExistsException;
import lt.techin.eventify.model.Role;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.RoleRepository;
import lt.techin.eventify.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.roleRepository = roleRepository;
    }

    public User saveUser(CreateUserRequest dto) {

        if(userRepository.existsByEmail(dto.email())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        if(userRepository.existsByUsername(dto.username())) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }

        Role roleUser = roleRepository.findByName("USER").orElseThrow();
        User newUser = userMapper.toUser(dto);
        newUser.setPassword(passwordEncoder.encode(dto.password()));
        newUser.setRegisteredAt(LocalDateTime.now());
        newUser.setRoles(Set.of(roleUser));

        return userRepository.save(newUser);
    }
}
