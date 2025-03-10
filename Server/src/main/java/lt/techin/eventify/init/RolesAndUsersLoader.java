package lt.techin.eventify.init;

import lt.techin.eventify.model.Role;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.RoleRepository;
import lt.techin.eventify.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Set;

@Component
public class RolesAndUsersLoader implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public RolesAndUsersLoader(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        Role userRole = roleRepository.findByName("USER".toUpperCase())
                .orElseGet(() -> roleRepository.save(new Role("USER")));

        Role adminRole = roleRepository.findByName("ADMIN".toUpperCase())
                .orElseGet(() -> roleRepository.save(new Role("ADMIN")));

        if (userRepository.findByUsername("User").isEmpty()) {
            User user = new User();
            user.setUsername("User");
            user.setEmail("user@user.com");
            user.setPassword(passwordEncoder.encode("User1234"));
            user.setRoles(Set.of(userRole));
            user.setRegisteredAt(LocalDateTime.now());
            userRepository.save(user);
        }

        if (userRepository.findByUsername("Admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("Admin");
            admin.setEmail("admin@admin.com");
            admin.setPassword(passwordEncoder.encode("Admin1234"));
            admin.setRoles(Set.of(userRole, adminRole));
            admin.setRegisteredAt(LocalDateTime.now());
            userRepository.save(admin);
        }
    }
}
