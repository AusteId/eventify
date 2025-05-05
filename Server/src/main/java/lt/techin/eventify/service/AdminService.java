package lt.techin.eventify.service;

import jakarta.transaction.Transactional;
import lt.techin.eventify.dto.ban.AdminCommentResponse;
import lt.techin.eventify.dto.ban.AdminMapper;
import lt.techin.eventify.dto.ban.BanRequest;
import lt.techin.eventify.dto.ban.BanResponse;
import lt.techin.eventify.dto.user.UserBanResponse;
import lt.techin.eventify.dto.user.UserMapper;
import lt.techin.eventify.exception.ActiveBanException;
import lt.techin.eventify.exception.AdminException;
import lt.techin.eventify.exception.NotFoundException;
import lt.techin.eventify.exception.UnauthorizedException;
import lt.techin.eventify.model.Ban;
import lt.techin.eventify.model.Role;
import lt.techin.eventify.model.User;
import lt.techin.eventify.repository.mysql.BanRepository;
import lt.techin.eventify.repository.mysql.EventCommentRepository;
import lt.techin.eventify.repository.mysql.RoleRepository;
import lt.techin.eventify.repository.mysql.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BanRepository banRe;
    private final UserMapper userMapper;
    private final AdminMapper adminMapper;
    private final EventCommentRepository eventCommentRepository;

    public AdminService(UserRepository userRepository, RoleRepository roleRepository, BanRepository banRe,
                        UserMapper userMapper, AdminMapper adminMapper, EventCommentRepository eventCommentRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.banRe = banRe;
        this.userMapper = userMapper;
        this.adminMapper = adminMapper;
        this.eventCommentRepository = eventCommentRepository;

    }

    @Transactional
    public BanResponse banUser(BanRequest request) {
        User user = userRepository.findById(request.userId()).orElseThrow(() -> new NotFoundException("User not found"));
        User admin = userRepository.findById(request.adminId()).orElseThrow(() -> new NotFoundException("Admin not found"));

        boolean isAdmin = admin.getRoles()
                .stream()
                .anyMatch(role -> role.getName().equalsIgnoreCase("ADMIN"));

        boolean isUserAdmin = user.getRoles()
                .stream()
                .anyMatch(role -> role.getName().equalsIgnoreCase("ADMIN"));

        if (!isAdmin) {
            throw new UnauthorizedException("Only admins can ban users");
        }

        if (isUserAdmin) {
            throw new AdminException("Cannot ban an admin");
        }

        Optional<Ban> activeBan = banRe.findByUserAndActiveTrue(user);
        if (activeBan.isPresent()) {
            throw new ActiveBanException("User already has an active ban");
        }

        Role bannedRole = roleRepository.findByName("BANNED".toUpperCase())
                .orElseGet(() -> roleRepository.save(new Role("BANNED")));

        Role userRole = roleRepository.findByName("USER").orElseThrow(() -> new NotFoundException("Role not found"));
        Set<Role> currentRoles = new HashSet<>(user.getRoles());
        currentRoles.remove(userRole);
        currentRoles.add(bannedRole);

        user.setRoles(currentRoles);

        userRepository.save(user);

        Ban ban = new Ban();
        ban.setUser(user);
        ban.setAdmin(admin);
        ban.setReason(request.reason());
        ban.setStartTime(LocalDateTime.now());
        if (request.duration() == null) {
            ban.setEndTime(null);
        } else {
            ban.setEndTime(LocalDateTime.now().plusDays(request.duration()));
        }
        ban.setActive(true);

        banRe.save(ban);

        return new BanResponse(user.getId(), admin.getId(),ban.getId(), ban.getReason(), ban.getStartTime(),
                ban.getEndTime(),
                ban.isActive(), admin.getUsername(), user.getUsername());
    }

    @Scheduled(cron = "0 */15 * * * *")
    public void checkExpiredBans() {
        LocalDateTime now = LocalDateTime.now();
        List<Ban> expiredBans = banRe.findByEndTimeBeforeAndActiveTrue(now);

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new NotFoundException("User role not found"));

        Role bannedRole = roleRepository.findByName("BANNED")
                .orElseThrow(() -> new NotFoundException("Banned role not found"));

        for (Ban ban : expiredBans) {
            User user = ban.getUser();
            Set<Role> roles = new HashSet<>(user.getRoles());
            roles.remove(bannedRole);
            roles.add(userRole);
            user.setRoles(roles);
            userRepository.save(user);

            ban.setActive(false);
            banRe.save(ban);
        }
    }

    public Page<BanResponse> getUserBanHistory(Long userId, Pageable pageable) {
        User user =
                userRepository.findById(userId).orElseThrow(() -> new NotFoundException(
                        "User not found"));
        return banRe.findByUser(user, pageable).map(ban -> new BanResponse(ban.getUser().getId(), ban.getAdmin().getId(), ban.getId(), ban.getReason(), ban.getStartTime(),
                ban.getEndTime(), ban.isActive(), ban.getAdmin().getUsername(), ban.getUser().getUsername()));
    }

    @Transactional
    public String unbanUserDirectly(Long banId) {
        Ban activeBan = banRe.findByIdAndActiveTrue(banId).orElseThrow(() -> new NotFoundException("Ban not found"));
        User user = activeBan.getUser();
        if (activeBan.getEndTime() != null) {
            activeBan.setEndTime(LocalDateTime.now());
        }

        activeBan.setActive(false);

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new NotFoundException("User role not found"));

        Role bannedRole = roleRepository.findByName("BANNED")
                .orElseThrow(() -> new NotFoundException("Banned role not found"));

        Set<Role> roles = new HashSet<>(user.getRoles());
        roles.remove(bannedRole);
        roles.add(userRole);
        user.setRoles(roles);
        userRepository.save(user);

        banRe.save(activeBan);

        return user.getUsername() + " was unbanned at " + LocalDateTime.now();
    }

//    public Page<UserBanResponse> getCurrentlyBannedUsers(Pageable pageable) {
//        Role bannedRole = roleRepository.findByName("BANNED").orElseThrow();
//        return userRepository.findByRolesContaining(bannedRole, pageable).map(userMapper::toDTO);
//    }

    public Optional<BanResponse> getActiveBan(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return banRe.findByUserAndActiveTrue(user)
                .map(ban -> new BanResponse(
                        ban.getUser().getId(),
                        ban.getAdmin().getId(),
                        ban.getId(),
                        ban.getReason(),
                        ban.getStartTime(),
                        ban.getEndTime(),
                        ban.isActive(),
                        ban.getAdmin().getUsername(),
                        ban.getUser().getUsername()
                ));
    }

    public String getUsersUsername(Long userId) {
        return userRepository.findById(userId).map(User::getUsername).orElseThrow(() -> new NotFoundException("User not found"));
    }

    public Page<BanResponse> getBansWithFilter(
            Long userId,
            String username,
            Long adminId,
            String adminName,
            Boolean active,
            LocalDateTime startDateAfter,
            LocalDateTime startDateBefore,
            LocalDateTime endDateAfter,
            LocalDateTime endDateBefore,
            Pageable pageable
    ) {

        Page<Ban> bans = banRe.findWithFilters(userId,username, adminId, adminName, active, startDateAfter,
                startDateBefore,
                endDateAfter, endDateBefore, pageable);

        return bans == null ? Page.empty() : bans.map(ban -> new BanResponse(
                ban.getUser().getId(),
                ban.getAdmin().getId(),
                ban.getId(),
                ban.getReason(),
                ban.getStartTime(),
                ban.getEndTime(),
                ban.isActive(),
                ban.getAdmin().getUsername(),
                ban.getUser().getUsername()
        ));
    }

    public Page<AdminCommentResponse> getCommentsByUser(Long userId, String searchTerm, Pageable pageable) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException(
                "User not found"));
        return eventCommentRepository.findByUserWithSearch(user, searchTerm, pageable).map(adminMapper::commentToDTO);
    }
}
