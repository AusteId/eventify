package lt.techin.eventify.init;

import lt.techin.eventify.dto.user.UserMapper;
import lt.techin.eventify.model.Role;
import lt.techin.eventify.model.User;
import lt.techin.eventify.model.UserImage;
import lt.techin.eventify.repository.mysql.RoleRepository;
import lt.techin.eventify.repository.mysql.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Component
@Profile("dev")
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

      UserImage avatar = UserMapper.DefaultImage("static/default-user-image.png");

      User user = new User();
      user.setUsername("User");
      user.setEmail("user@user.com");
      user.setPassword(passwordEncoder.encode("User1234"));
      user.setCity("User");
      user.setDescription("User description");
      user.setBirthDate(LocalDate.EPOCH);
      user.setRoles(Set.of(userRole));
      userRepository.save(user);
    }

    if (userRepository.findByUsername("Admin").isEmpty()) {
      UserImage adminAvatar = UserMapper.DefaultImage("static/default-admin-image.png");

      User admin = new User();
      admin.setUsername("Admin");
      admin.setEmail("admin@admin.com");
      admin.setPassword(passwordEncoder.encode("Admin1234"));
      admin.setCity("Admin");
      admin.setDescription("Admin description");
      admin.setBirthDate(LocalDate.EPOCH);
      admin.setRoles(Set.of(userRole, adminRole));
      userRepository.save(admin);
    }
  }
}