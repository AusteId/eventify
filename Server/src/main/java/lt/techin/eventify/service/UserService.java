package lt.techin.eventify.service;

import lt.techin.eventify.dto.user.CreateUserRequest;
import lt.techin.eventify.dto.user.UserMapper;
import lt.techin.eventify.exception.EmailAlreadyExistsException;
import lt.techin.eventify.exception.UsernameAlreadyExistsException;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    //    private final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    public User saveUser(CreateUserRequest dto) {

        if(userRepository.existsByEmail(dto.email())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        if(userRepository.existsByUsername(dto.username())) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }

        User newUser = userMapper.toUser(dto);
        newUser.setPassword(passwordEncoder.encode(dto.password()));

        return userRepository.save(newUser);
    }
}
