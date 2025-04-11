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
                "sports", "static/default-football.jpg", "football", admin, "Extreme", "Vilnius", "Pylimo g. 35");
        createAndSaveEvent("Chess Championship", "The ultimate chess battle.",
                "boardgames", "static/default-chess.jpg", "chess", admin, "Intermediate", "Kaunas", "Maironio g. 5");
        createAndSaveEvent("Rock Concert", "A night of hard rock music.",
                "music", "static/default-rock.jpg", "rock", admin, "Advanced", "Klaipėda", "Pajūrio g. 12");
        createAndSaveEvent("Art Exhibition", "A showcase of modern art.",
                "arts and culture", "static/default-art.jpg", "art", admin, "Beginner", "Šiauliai", "Vilniaus g. 44");
        createAndSaveEvent("Food Festival", "A celebration of local Lithuanian cuisine.",
                "food and drinks", "static/default-food.jpg", "food", admin, "All Welcome", "Panevėžys", "Klaipėdos g. 13");
        createAndSaveEvent("Hiking Adventure", "Explore the wilderness with an amazing hike.",
                "outdoor", "static/default-hike.jpg", "hiking", admin, "Intermediate", "Alytus", "Tvirtovės g. 11");
        createAndSaveEvent("Yoga Retreat", "A peaceful retreat to enhance mind and body.",
                "wellness", "static/default-yoga.jpg", "yoga", admin, "Beginner", "Marijampolė", "J. Basanavičiaus g. 24");
        createAndSaveEvent("Tech Talk", "An event about the latest in technology.",
                "technology", "static/default-tech.jpg", "tech", admin, "Advanced", "Vilnius", "Gedimino pr. 10");
        createAndSaveEvent("Business Conference", "A conference for entrepreneurs and business owners.",
                "business", "static/default-business.jpg", "business", admin, "Intermediate", "Kaunas", "Laisvės al. 53");
        createAndSaveEvent("Cooking Masterclass", "Learn how to cook Lithuanian traditional dishes.",
                "food and drinks", "static/default-cooking.jpg", "cooking", admin, "All Welcome", "Klaipėda", "Kurpių g. 6");
        createAndSaveEvent("Jazz Night", "Enjoy a relaxing jazz music night.",
                "music", "static/default-jazz.jpg", "jazz", admin, "Beginner", "Panevėžys", "Vasario 16-osios g. 31");
        createAndSaveEvent("Photography Workshop", "Learn the art of photography from experts.",
                "arts and culture", "static/default-photography.jpg", "photography", admin, "Intermediate", "Alytus", "A. Juozapavičiaus g. 32");
        createAndSaveEvent("Vegan Food Gathering", "Vegan food lovers unite for a unique gathering.",
                "food and drinks", "static/default-vegan.jpg", "vegan", admin, "All Welcome", "Marijampolė", "Vytauto g. 50");
        createAndSaveEvent("Outdoor Picnic", "Enjoy a day outdoors with a picnic and games.",
                "outdoor", "static/default-picnic.jpg", "picnic", admin, "Beginner", "Vilnius", "Naugarduko g. 20");
        createAndSaveEvent("Mental Health Awareness", "A seminar focused on mental health and well-being.",
                "wellness", "static/default-mentalhealth.jpg", "mentalhealth", admin, "Intermediate", "Kaunas", "P. Kalpoko g. 16");
        createAndSaveEvent("Startup Pitch", "Pitch your startup to investors and enthusiasts.",
                "business", "static/default-startup.jpg", "startup", admin, "Advanced", "Klaipėda", "Baltijos pr. 5");
        createAndSaveEvent("Coding Bootcamp", "Learn to code in a fast-paced, interactive bootcamp.",
                "technology", "static/default-coding.jpg", "coding", admin, "Extreme", "Šiauliai", "Vilniaus g. 85");
        createAndSaveEvent("Painting Workshop", "Express yourself through painting in this creative workshop.",
                "arts and culture", "static/default-painting.jpg", "painting", admin, "Beginner", "Alytus", "J. Žukausko g. 9");
        createAndSaveEvent("Tech Startup Networking", "A networking event for budding tech entrepreneurs.",
                "business", "static/default-networking.jpg", "networking", admin, "Intermediate", "Vilnius", "Ozo g. 10");
        createAndSaveEvent("Basketball Tournament", "Join our exciting basketball tournament with teams from all over.",
                "sports", "static/default-basketball.jpg", "basketball", admin, "Advanced", "Vilnius", "Švitrigailos g. 11");

      }
    }
  }
}