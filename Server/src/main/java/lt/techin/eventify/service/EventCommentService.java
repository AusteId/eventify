package lt.techin.eventify.service;

import lt.techin.eventify.model.EventComment;
import lt.techin.eventify.repository.mysql.EventCommentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventCommentService {
  private final EventCommentRepository eventCommentRepository;

  public EventCommentService(EventCommentRepository eventCommentRepository) {
    this.eventCommentRepository = eventCommentRepository;
  }

  public List<EventComment> getAll() {
    return eventCommentRepository.findAll();
  }

  public EventComment findById(long id) {
    return eventCommentRepository.findById(id).orElse(null);
  }

  public EventComment save(EventComment eventComment) {
    return eventCommentRepository.save(eventComment);
  }

  public void delete(long id) {
    eventCommentRepository.deleteById(id);
  }
}
