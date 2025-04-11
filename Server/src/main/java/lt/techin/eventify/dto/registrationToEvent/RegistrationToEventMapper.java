package lt.techin.eventify.dto.registrationToEvent;

import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.RegistrationToEvent;
import lt.techin.eventify.model.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RegistrationToEventMapper {

  //    public RegistrationToEventResponse toEventRegistrationResponse(RegistrationToEvent registration, UserJoinToEvent userJoinToEvent, JoinEventResponse joinEventResponse) {
//        return new RegistrationToEventResponse(
//                registration.getId(),
//                new UserJoinToEvent(userJoinToEvent.userId(), userJoinToEvent.userAvatar(), userJoinToEvent.userName()),
//                new JoinEventResponse(joinEventResponse.category(),joinEventResponse.organizerResponse(),joinEventResponse.name(),joinEventResponse.startDateTime(),joinEventResponse.endDateTime(),joinEventResponse.createdAt(), joinEventResponse.description(), joinEventResponse.minAge(), joinEventResponse.maxAge(), joinEventResponse.experienceLevel(), joinEventResponse.maxParticipants(), joinEventResponse.city(), joinEventResponse.address(), joinEventResponse.photoPath()),
//                registration.getRegisteredAt()
//        );
//    }
  public RegistrationToEventResponse toEventRegistrationResponse(RegistrationToEvent registrationToEvent) {
    User user = registrationToEvent.getUser();
    UserJoinToEvent userJoinToEvent = new UserJoinToEvent(
            user.getId(),
            user.getUsername()
    );

    Event event = registrationToEvent.getEvent();
    JoinEventResponse joinEventResponse = new JoinEventResponse(
            event.getCategory(),
            new OrganizerResponse(event.getOrganizer().getId(), event.getOrganizer().getUsername()),
            event.getName(),
            event.getStartDateTime(),
            event.getEndDateTime(),
            event.getCreatedAt(),
            event.getDescription(),
            event.getMinAge(),
            event.getMaxAge(),
            event.getExperienceLevel(),
            event.getMaxParticipants(),
            event.getCity(),
            event.getAddress(),
            event.getPhotoPath()
    );


    return new RegistrationToEventResponse(
            registrationToEvent.getId(),
            userJoinToEvent,
            joinEventResponse,
            registrationToEvent.getRegisteredAt()
    );
  }

  public UserRegisteredToEventResponse toUserRegisteredToEvent(RegistrationToEvent registrationToEvent) {
    UserJoinToEvent userJoinToEvent = new UserJoinToEvent(
            registrationToEvent.getUser().getId(),
            registrationToEvent.getUser().getUsername()
    );

    return new UserRegisteredToEventResponse(
            registrationToEvent.getId(),
            userJoinToEvent,
            registrationToEvent.getRegisteredAt()
    );
  }

}
