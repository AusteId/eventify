package lt.techin.eventify.service;

import jakarta.annotation.PostConstruct;
import lt.techin.eventify.model.Event;
import lt.techin.eventify.model.TeamMember;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
public class R2Service {

    private final S3Client s3Client;
    private static final String DEFAULT_USER_IMAGE_KEY = "defaults/user-default.jpg";
    private static final String DEFAULT_EVENT_IMAGE_KEY = "defaults/event-default.jpg";
    private static final String DEFAULT_TEAM_MEMBER_IMAGE_KEY = "defaults/team-member-default.jpg";

    public R2Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Value("${r2.bucketName}")
    private String bucketName;

    private byte[] createNew(BufferedImage originalImage) throws IOException {
        // Create a new BufferedImage with RGB type to ensure compatibility with JPG
        BufferedImage jpgImage = new BufferedImage(
                originalImage.getWidth(),
                originalImage.getHeight(),
                BufferedImage.TYPE_INT_RGB
        );
        // Convert the image to JPG format in a byte array
        jpgImage.createGraphics().drawImage(originalImage, 0, 0, null);
        ByteArrayOutputStream jpgOutputStream = new ByteArrayOutputStream();
        ImageIO.write(jpgImage, "jpg", jpgOutputStream);
        return jpgOutputStream.toByteArray();
    }

    // Upload Event Image
    public void uploadEventImage(MultipartFile file, long eventId) throws IOException {
        if (file == null || file.isEmpty()) {
            return;
        }
        InputStream inputStream = file.getInputStream();
        BufferedImage originalImage = ImageIO.read(inputStream);
        if (originalImage == null) {
            throw new IOException("Could not read the uploaded image file.");
        }

        byte[] jpgBytes = createNew(originalImage);
        String key = String.format("events/%s/image.jpg", eventId);
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(jpgBytes));
    }

    // Upload User Avatar
    public void uploadUserAvatar(MultipartFile avatar, long userId) throws IOException {
        if (avatar == null || avatar.isEmpty()) {
            return;
        }
        InputStream inputStream = avatar.getInputStream();
        BufferedImage originalImage = ImageIO.read(inputStream);
        if (originalImage == null) {
            throw new IOException("Could not read uploaded file");
        }

        byte[] jpgBytes = createNew(originalImage);
        String s3Key = String.format("users/%s/image.jpg", userId);
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Key)
                .build();
        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(jpgBytes));
    }

    // Upload Team Member Image
    public String uploadTeamMemberImage(MultipartFile file, String teamMemberName) throws IOException {
        if (file == null || file.isEmpty()) {
            return null; // No image provided, return null
        }

        InputStream inputStream = file.getInputStream();
        BufferedImage originalImage = ImageIO.read(inputStream);
        if (originalImage == null) {
            throw new IOException("Could not read the uploaded image file.");
        }

        byte[] jpgBytes = createNew(originalImage);
        String key = String.format("team-members/%s/image.jpg", teamMemberName); // Use team member name as a key

        // Upload the image to S3
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(jpgBytes));

        // Return the key or URL of the uploaded image (depending on your preference)
        return key; // You can also return a URL if needed, like:
        // return "https://<bucket-name>.s3.amazonaws.com/" + key;
    }

    // Return team member image
    public byte[] getTeamMemberImage(long teamMemberId, String imageKey) {
        String key = imageKey != null ? imageKey : String.format("team-members/%s/image.jpg", teamMemberId);
        try {
            return downloadFile(key); // This will download the image using the key
        } catch (Exception e) {
            // If the image does not exist, return a default image (for example, a placeholder)
            return downloadFile(DEFAULT_USER_IMAGE_KEY); // Or another default image for missing team member image
        }
    }



    // Download Team Member Image
    public byte[] downloadTeamMemberImage(String teamMemberName) {
        String key = String.format("team-members/%s/image.jpg", teamMemberName);
        try {
            return downloadFile(key);
        } catch (Exception e) {
            return downloadFile(DEFAULT_TEAM_MEMBER_IMAGE_KEY);
        }
    }

    // Download Event Image
    public byte[] downloadEventAvatar(long eventId) {
        String eventKey = String.format("events/%s/image.jpg", eventId);
        try {
            return downloadFile(eventKey);
        } catch (Exception e) {
            return downloadFile(DEFAULT_EVENT_IMAGE_KEY);
        }
    }

    // Download User Avatar
    public byte[] downloadUserAvatar(long userId) {
        String userKey = String.format("users/%s/image.jpg", userId);
        try {
            return downloadFile(userKey);
        } catch (Exception e) {
            return downloadFile(DEFAULT_USER_IMAGE_KEY);
        }
    }

    // Common method to download file from S3
    public byte[] downloadFile(String key) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        ResponseBytes<GetObjectResponse> responseBytes = s3Client.getObjectAsBytes(getObjectRequest);
        return responseBytes.asByteArray();
    }

    // Delete a file from S3
    public void deleteFile(String key) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3Client.deleteObject(deleteObjectRequest);
    }

    // Default Image Handling
    private byte[] createDefault(Resource resource) throws IOException {
        byte[] imageBytes = FileCopyUtils.copyToByteArray(resource.getInputStream());
        BufferedImage defaultImage = ImageIO.read(new ByteArrayInputStream(imageBytes));
        return createNew(defaultImage);
    }

    @PostConstruct
    public void initDefaultImages() {
        try {
            if (!objectExists(DEFAULT_USER_IMAGE_KEY)) {
                Resource resource = new ClassPathResource("static/default-user-image.png");
                byte[] jpgBytes = createDefault(resource);
                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(DEFAULT_USER_IMAGE_KEY)
                        .build();
                s3Client.putObject(putObjectRequest, RequestBody.fromBytes(jpgBytes));
            }

            if (!objectExists(DEFAULT_EVENT_IMAGE_KEY)) {
                Resource resource = new ClassPathResource("static/default-event.jpg");
                byte[] jpgBytes = createDefault(resource);
                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(DEFAULT_EVENT_IMAGE_KEY)
                        .build();
                s3Client.putObject(putObjectRequest, RequestBody.fromBytes(jpgBytes));
            }

            if (!objectExists(DEFAULT_TEAM_MEMBER_IMAGE_KEY)) {
                Resource resource = new ClassPathResource("static/default-user-image.png");
                byte[] jpgBytes = createDefault(resource);
                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(DEFAULT_TEAM_MEMBER_IMAGE_KEY)
                        .build();
                s3Client.putObject(putObjectRequest, RequestBody.fromBytes(jpgBytes));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private boolean objectExists(String key) {
        try {
            s3Client.headObject(request -> request.bucket(bucketName).key(key));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // For downloading event images based on custom key
    public byte[] downloadEventImageWithCustomKey(String customKey) {
        String eventKey = String.format("events/%s/image.jpg", customKey);
        try {
            return downloadFile(eventKey);
        } catch (Exception e) {
            return downloadFile(DEFAULT_EVENT_IMAGE_KEY);
        }
    }

    // For downloading team member images based on custom key
    public byte[] downloadTeamMemberImageWithCustomKey(String customKey) {
        String teamMemberKey = String.format("team-members/%s/image.jpg", customKey);
        try {
            return downloadFile(teamMemberKey);
        } catch (Exception e) {
            return downloadFile(DEFAULT_TEAM_MEMBER_IMAGE_KEY);
        }
    }

    public void uploadEventImageWithCustomKey(String resourcePath, String customKey) throws IOException {
        Resource resource = new ClassPathResource(resourcePath);
        byte[] imageBytes = FileCopyUtils.copyToByteArray(resource.getInputStream());

        ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes);
        BufferedImage originalImage = ImageIO.read(bis);

        if (originalImage == null) {
            throw new IOException("Could not read image file.");
        }

        byte[] jpgBytes = createNew(originalImage);

        String s3Key = String.format("events/%s/image.jpg", customKey);

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Key)
                .build();
        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(jpgBytes));
    }

    public byte[] getEventImage(long eventId, String imageKey) {
        if (imageKey != null && !imageKey.isEmpty()) {
            return downloadEventImageWithCustomKey(imageKey);
        } else {
            return downloadEventAvatar(eventId);
        }
    }
}
