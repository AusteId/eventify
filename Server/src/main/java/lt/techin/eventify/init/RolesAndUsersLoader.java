package lt.techin.eventify.init;

import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.Role;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.mysql.CategoryRepository;
import lt.techin.eventify.repository.mysql.EventRepository;
import lt.techin.eventify.repository.mysql.RoleRepository;
import lt.techin.eventify.repository.mysql.UserRepository;
import lt.techin.eventify.service.R2Service;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Component
@Profile("dev")
public class RolesAndUsersLoader implements CommandLineRunner {

  private final RoleRepository roleRepository;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final R2Service r2Service;
  private final EventRepository eventRepository;
  private final CategoryRepository categoryRepository;

  @Autowired
  public RolesAndUsersLoader(CategoryRepository categoryRepository, EventRepository eventRepository, RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder,R2Service r2Service) {
    this.roleRepository = roleRepository;
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.r2Service = r2Service;
    this.eventRepository = eventRepository;
    this.categoryRepository = categoryRepository;
  }

  private void createAndSaveEvent(String name, String description, String category,
                                  String imageResource, String imageKey, User admin, String experienceLevel,String city,String address) {
    int randomDays = (int) (Math.random() * 181);
    LocalDateTime startDate = LocalDateTime.now().plusDays(randomDays);
    LocalDateTime endDate = startDate.plusDays((int) (Math.random() * 12) + 3);

    GeometryFactory geometryFactory = new GeometryFactory();
    Point randomPoint = geometryFactory.createPoint(
            new Coordinate(
                    Math.random() * 360 - 180,
                    Math.random() * 180 - 90
            )
    );

    Event event = new Event(
            categoryRepository.findByName(category).orElseThrow(),
            admin,
            name,
            startDate,
            endDate,
            description,
            18,
            (int)(Math.random() * 60) + 18,
            experienceLevel,
            (int)(Math.random() * 100) + 1,
            city,
            address,
            randomPoint
    );

    Event savedEvent = eventRepository.save(event);
    try {
      r2Service.uploadEventImageWithCustomKey(imageResource, imageKey);
      savedEvent.setImageKey(imageKey);
      eventRepository.save(savedEvent);
    } catch (IOException e) {
      // logger
    }
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
      user.setCity("User");
      user.setDescription("User description");
      user.setBirthDate(LocalDate.EPOCH);
      user.setRoles(Set.of(userRole));
      userRepository.save(user);
    }

    if (userRepository.findByUsername("Admin").isEmpty()) {
      User admin = new User();
      admin.setUsername("Admin");
      admin.setEmail("admin@admin.com");
      admin.setPassword(passwordEncoder.encode("Admin1234"));
      admin.setCity("Admin");
      admin.setDescription("Admin description");
      admin.setBirthDate(LocalDate.EPOCH);
      admin.setRoles(Set.of(userRole, adminRole));
      userRepository.save(admin);

      if (eventRepository.count() == 0) {
        createAndSaveEvent("Football Tournament", "Greatest football tourney...",
                "sports", "static/default-football.jpg",
                "football", admin,"Extreme","Drogheda",
                "18 Cedarfield Close");
      }
    }
  }
}