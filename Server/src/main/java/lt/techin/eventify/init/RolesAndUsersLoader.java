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
                                  String imageResource, String imageKey, User admin, String experienceLevel,String city,String address, double longitude, double latitude ) {
    int randomDays = (int) (Math.random() * 181);
    LocalDateTime startDate = LocalDateTime.now().plusDays(randomDays).plusMinutes((int) (Math.random() * 200));
    LocalDateTime endDate = startDate.plusDays((int) (Math.random() * 12) + 3).plusMinutes((int) (Math.random() * 400));

    GeometryFactory geometryFactory = new GeometryFactory();

    Event event = new Event();
    event.setCategory(categoryRepository.findByName(category).orElseThrow());
    event.setOrganizer(admin);
    event.setName(name);
    event.setStartDateTime(startDate);
    event.setEndDateTime(endDate);
    event.setDescription(description);
    event.setMinAge(18);
    event.setMaxAge((int)(Math.random() * 60) + 18);
    event.setExperienceLevel(experienceLevel);
    event.setMaxParticipants((int)(Math.random() * 100) + 1);
    event.setCity(city);
    event.setAddress(address);
    event.setLocation(geometryFactory.createPoint(new Coordinate(latitude,longitude)));
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

    roleRepository.findByName("BANNED".toUpperCase())
            .orElseGet(() -> roleRepository.save(new Role("BANNED")));

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
                "sports", "static/default-football.jpg", "football", admin, "Extreme", "Vilnius", "Pylimo g. 35",54.6776696063068, 25.280131981173376);
        createAndSaveEvent("Chess Championship", "The ultimate chess battle.",
                "boardgames", "static/default-chess.jpg", "chess", admin, "Intermediate", "Kaunas", "Maironio g. 5",54.89624833429815, 23.909087084601293);
        createAndSaveEvent("Rock Concert", "A night of hard rock music.",
                "music", "static/default-rock.jpg", "rock", admin, "Advanced", "Klaipėda", "Pajūrio g. 12",55.75336324091884, 21.151324942300274);
        createAndSaveEvent("Art Exhibition", "A showcase of modern art.",
                "arts and culture", "static/default-art.jpg", "art", admin, "Beginner", "Šiauliai", "Vilniaus g. 44",55.926631196048646, 23.339407393860537);
        createAndSaveEvent("Food Festival", "A celebration of local Lithuanian cuisine.",
                "food and drinks", "static/default-food.jpg", "food", admin, "All Welcome", "Panevėžys", "Klaipėdos g. 13",55.7271095507516, 24.354763098124565);
        createAndSaveEvent("Hiking Adventure", "Explore the wilderness with an amazing hike.",
                "outdoor", "static/default-hike.jpg", "hiking", admin, "Intermediate", "Alytus", "Tvirtovės g. 11",54.399193676585774, 24.037476769244844);
        createAndSaveEvent("Yoga Retreat", "A peaceful retreat to enhance mind and body.",
                "wellness", "static/default-yoga.jpg", "yoga", admin, "Beginner", "Marijampolė", "J. Basanavičiaus g. 24",54.54425216676634, 23.364671598084538);
        createAndSaveEvent("Tech Talk", "An event about the latest in technology.",
                "technology", "static/default-tech.jpg", "tech", admin, "Advanced", "Vilnius", "Gedimino pr. 10",54.68636289466039, 25.281911411584446);
        createAndSaveEvent("Business Conference", "A conference for entrepreneurs and business owners.",
                "business", "static/default-business.jpg", "business", admin, "Intermediate", "Kaunas", "Laisvės al. 53",54.89720064263335, 23.914312499941353);
        createAndSaveEvent("Cooking Masterclass", "Learn how to cook Lithuanian traditional dishes.",
                "food and drinks", "static/default-cooking.jpg", "cooking", admin, "All Welcome", "Klaipėda", "Kurpių g. 6",55.70958713026553, 21.134149399968802);
        createAndSaveEvent("Jazz Night", "Enjoy a relaxing jazz music night.",
                "music", "static/default-jazz.jpg", "jazz", admin, "Beginner", "Panevėžys", "Vasario 16-osios g. 31",55.731338619310954, 24.354349826959638);
        createAndSaveEvent("Photography Workshop", "Learn the art of photography from experts.",
                "arts and culture", "static/default-photography.jpg", "photography", admin, "Intermediate", "Alytus", "A. Juozapavičiaus g. 32",54.40292681900545, 24.062620398079925);
        createAndSaveEvent("Vegan Food Gathering", "Vegan food lovers unite for a unique gathering.",
                "food and drinks", "static/default-vegan.jpg", "vegan", admin, "All Welcome", "Marijampolė", "Vytauto g. 50",54.545420092948326, 23.346830784589727);
        createAndSaveEvent("Outdoor Picnic", "Enjoy a day outdoors with a picnic and games.",
                "outdoor", "static/default-picnic.jpg", "picnic", admin, "Beginner", "Vilnius", "Naugarduko g. 20",54.67662314246037, 25.27497521158413);
        createAndSaveEvent("Mental Health Awareness", "A seminar focused on mental health and well-being.",
                "wellness", "static/default-mentalhealth.jpg", "mentalhealth", admin, "Intermediate", "Kaunas", "P. Kalpoko g. 16",54.905933542276095, 23.916892057611644);
        createAndSaveEvent("Startup Pitch", "Pitch your startup to investors and enthusiasts.",
                "business", "static/default-startup.jpg", "startup", admin, "Advanced", "Klaipėda", "Baltijos pr. 5",55.68936317808325, 21.17735901161816);
        createAndSaveEvent("Coding Bootcamp", "Learn to code in a fast-paced, interactive bootcamp.",
                "technology", "static/default-coding.jpg", "coding", admin, "Extreme", "Šiauliai", "Vilniaus g. 85",55.92511728438101, 23.32744493861637);
        createAndSaveEvent("Painting Workshop", "Express yourself through painting in this creative workshop.",
                "arts and culture", "static/default-painting.jpg", "painting", admin, "Beginner", "Vilnius", "J. Žukausko g. 9",54.70775026796603, 25.293804204627545);
        createAndSaveEvent("Tech Startup Networking", "A networking event for budding tech entrepreneurs.",
                "business", "static/default-networking.jpg", "networking", admin, "Intermediate", "Vilnius", "Ozo g. 10",54.71384513009641, 25.278693069255276);
        createAndSaveEvent("Basketball Tournament", "Join our exciting basketball tournament with teams from all over.",
                "sports", "static/default-basketball.jpg", "basketball", admin, "Advanced", "Vilnius", "Švitrigailos g. 11",54.675575738839186, 25.26660189808899);

      }
    }
  }
}