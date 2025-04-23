package lt.techin.eventify.controller;


import jakarta.validation.Valid;
import lt.techin.eventify.dto.ban.BanRequest;
import lt.techin.eventify.dto.ban.BanResponse;
import lt.techin.eventify.dto.event.EventMapResponse;
import lt.techin.eventify.dto.event.EventSearchRequest;
import lt.techin.eventify.dto.event.EventSummaryResponse;
import lt.techin.eventify.dto.user.UserBanResponse;
import lt.techin.eventify.exception.NotFoundException;
import lt.techin.eventify.service.AdminService;
import lt.techin.eventify.service.EventService;
import lt.techin.eventify.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserService userService;
    private final AdminService adminService;
    private final EventService eventService;

    public AdminController(UserService userService, AdminService adminService, EventService eventService) {
        this.userService = userService;
        this.adminService = adminService;
        this.eventService = eventService;
    }

    @GetMapping("/bans")
    public ResponseEntity<Page<BanResponse>> getBans(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long adminId,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDateAfter,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDateBefore,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDateAfter,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDateBefore,
            @PageableDefault(size = 10, sort = "startTime", direction = Sort.Direction.DESC) Pageable pageable
            ) {
        return ResponseEntity.ok(adminService.getBansWithFilter(userId,adminId,active,startDateAfter,startDateBefore,endDateAfter,endDateBefore,pageable));
    }

    @PatchMapping("/ban-user")
    public ResponseEntity<BanResponse> banUser(@Valid @RequestBody BanRequest request) {
        return ResponseEntity.ok(adminService.banUser(request));
    }

    @GetMapping("/bans/history/{userId}")
    public ResponseEntity<Page<BanResponse>> getUserBanHistory(@PathVariable Long userId,
                                                               @PageableDefault(size = 15, sort = "endTime",direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(adminService.getUserBanHistory(userId,pageable));
    }

    @GetMapping("/bans/all")
    public ResponseEntity<Page<UserBanResponse>> getAllBannedUsers(Pageable pageable) {
        return ResponseEntity.ok(adminService.getCurrentlyBannedUsers(pageable));
    }

    @PatchMapping("/unban/{banId}")
    public ResponseEntity<String> unbanUser(@PathVariable Long banId) {
        return ResponseEntity.ok(adminService.unbanUserDirectly(banId));
    }

    @GetMapping("/bans/active/{userId}")
    public ResponseEntity<BanResponse> getActiveBan(@PathVariable Long userId) {
        BanResponse banResponse = adminService.getActiveBan(userId).orElseThrow(() -> new NotFoundException("Ban not found"));
        return ResponseEntity.ok(banResponse);
    }

    @GetMapping("/users")
    public ResponseEntity<Page<UserBanResponse>> getAllUsersPaged(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false, defaultValue = "true") boolean excludeAdmin,
            @PageableDefault(size = 10, sort = "username", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsersPaged(searchTerm, excludeAdmin, pageable));
    }

    @GetMapping("/creator/{userId}")
    public ResponseEntity<Page<EventSummaryResponse>> getEventsByCreator(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "startDateTime") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        Pageable pageable = PageRequest.of(
                page, size,
                Sort.by(Sort.Direction.fromString(sortDirection), sortBy)
        );

        Page<EventSummaryResponse> eventPage = eventService.getUserCreatedEvents(userId, pageable);

        return ResponseEntity.ok(eventPage);
    }

    @GetMapping("/creator/{userId}/map")
    public ResponseEntity<List<EventMapResponse>> getEventsForMapByCreator(
            @PathVariable Long userId,
            @Valid EventSearchRequest request) {

        List<EventMapResponse> events = eventService.findAllEventsForMapByCreator(
                userId,
                request.categoryName(),
                request.city(),
                request.startDateTime(),
                request.endDateTime(),
                request.experienceLevel(),
                request.minAge(),
                request.maxAge(),
                request.searchTerm()
        );

        return ResponseEntity.ok(events);
    }
}
