package lt.techin.eventify.dto.user;

import lt.techin.eventify.model.User;
import lt.techin.eventify.model.UserImage;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class UserMapper {

  public UserResponse toUserResponse(User user) {
    return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getCity(),
            user.getBirthDate(),
            user.getDescription(),
            user.getFavoriteEventCategories(),
            user.getPhotoPath(),
            user.getRoles());
  }

  public User toUser(CreateUserRequest dto) {
    User user = new User();
    user.setUsername(dto.username());
    user.setEmail(dto.email());
    user.setPassword(dto.password());
    user.setCity(dto.city());
    user.setDescription(dto.description());
    user.setBirthDate(dto.birthDate());
    return user;
  }

  public static UserImage imageToEntity(CreateUserRequest dto) throws IOException {
    if (dto.avatar() != null && !dto.avatar().isEmpty()) {
      UserImage avatar = new UserImage();
      avatar.setFilename(dto.avatar().getOriginalFilename());
      avatar.setContentType(dto.avatar().getContentType());
      avatar.setFileSize(dto.avatar().getSize());
      avatar.setUploadedAt(LocalDateTime.now());
      avatar.setData(dto.avatar().getBytes());
      return avatar;
    } else {
      try {
        return DefaultImage("static/default-user-image.png");
      } catch (IOException e) {
        throw new IOException("Could not load default user image" + e.getMessage());
      }
    }
  }

  public static UserImage DefaultImage(String path) throws IOException {
    Resource resource = new ClassPathResource(path);
    byte[] imageBytes = FileCopyUtils.copyToByteArray(resource.getInputStream());
    UserImage avatar = new UserImage();
    avatar.setFilename("default-user-image");
    avatar.setContentType("image/png");
    avatar.setData(imageBytes);
    avatar.setUploadedAt(LocalDateTime.now());
    avatar.setFileSize((long) imageBytes.length);
    return avatar;
  }
}
