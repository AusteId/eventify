package lt.techin.eventify.service;

import jakarta.annotation.PostConstruct;
import lt.techin.eventify.exception.FileValidityException;
import lt.techin.eventify.model.Event;
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

    public R2Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Value("${r2.bucketName}")
    private String bucketName;

    private byte[] createNew(BufferedImage originalImage) throws IOException{

        // Create a new BufferedImage with RGB type to ensure compatibility with JPG

        BufferedImage jpgImage = new BufferedImage(
                originalImage.getWidth(),
                originalImage.getHeight(),
                BufferedImage.TYPE_INT_RGB
        );

        // Convert the image to JPG format in a byte array


        jpgImage.createGraphics().drawImage(originalImage,0,0,null);
        ByteArrayOutputStream jpgOutputStream = new ByteArrayOutputStream();
        ImageIO.write(jpgImage, "jpg", jpgOutputStream);

        return jpgOutputStream.toByteArray();
    }

    private void checkFileValidity(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileValidityException("File cannot be empty");
        }
    }

    public void uploadEventImage(MultipartFile file, long eventId) throws IOException {
        checkFileValidity(file);

        // Convert the uploaded file to JPG
        InputStream inputStream = file.getInputStream();
        BufferedImage originalImage = ImageIO.read(inputStream);
        if (originalImage == null) {
            throw new IOException("Could not read the uploaded image file.");
        }

        byte[] jpgBytes = createNew(originalImage);

        // Define the S3 key and upload
        String key = String.format("events/%s/image.jpg", eventId); // Always save as image.jpg

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(jpgBytes));
    }

    public void uploadAboutUsProfile(MultipartFile profile, long memberId) throws IOException {
        checkFileValidity(profile);

        InputStream inputStream = profile.getInputStream();
        BufferedImage originalImage = ImageIO.read(inputStream);
        if (originalImage == null) {
            throw new IOException("Could not read uploaded file");
        }
        byte[] jpgBytes = createNew(originalImage);
        String key = String.format("about-us/%s/image.jpg",memberId);

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3Client.putObject(putObjectRequest,RequestBody.fromBytes(jpgBytes));
    }

    public void uploadUserAvatar(MultipartFile avatar, long userId) throws IOException {
       checkFileValidity(avatar);

        InputStream inputStream = avatar.getInputStream();
        BufferedImage originalImage = ImageIO.read(inputStream);
        if (originalImage == null) {
            throw new IOException("Could not read uploaded file");
        }

        byte[] jpgBytes = createNew(originalImage);

        String s3Key = String.format("users/%s/image.jpg",userId);

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Key)
                .build();
        s3Client.putObject(putObjectRequest,RequestBody.fromBytes(jpgBytes));
    }

    public byte[] downloadFile(String key) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        ResponseBytes<GetObjectResponse> responseBytes = s3Client.getObjectAsBytes(getObjectRequest);
        return responseBytes.asByteArray();
    }

    public void deleteFile(String key) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3Client.deleteObject(deleteObjectRequest);
    }

    //DEFAULT SECTION

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

                byte [] jpgBytes = createDefault(resource);

                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(DEFAULT_USER_IMAGE_KEY)
                        .build();
                s3Client.putObject(putObjectRequest, RequestBody.fromBytes(jpgBytes));
            }
            if (!objectExists(DEFAULT_EVENT_IMAGE_KEY)) {
                Resource resource = new ClassPathResource("static/default-event.jpg");
                byte [] jpgBytes = createDefault(resource);
                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(DEFAULT_EVENT_IMAGE_KEY)
                        .build();
                s3Client.putObject(putObjectRequest, RequestBody.fromBytes(jpgBytes));

            }
        } catch (Exception e) {
        }
    }

    public byte[] downloadEventAvatar(long eventId) {
        String eventKey = String.format("events/%s/image.jpg", eventId);
        try {
            return downloadFile(eventKey);
        } catch (Exception e) {
            return downloadFile(DEFAULT_EVENT_IMAGE_KEY);
        }
    }

    public byte[] downloadAboutUsAvatar(long memberId) {
        String key = String.format("about-us/%s/image.jpg",memberId);
        try {
            return downloadFile(key);
        } catch (Exception e) {
            return downloadFile(DEFAULT_USER_IMAGE_KEY);
        }
    }


    public byte[] downloadUserAvatar(long userId) {
        String userKey = String.format("users/%s/image.jpg", userId);
        try {
            return downloadFile(userKey);
        } catch (Exception e) {
            return downloadFile(DEFAULT_USER_IMAGE_KEY);
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

    // Potentially unnecessary, this is for db initialization, a method that does not rely on id and instead custom
    // string so no multiple copies of default images would be present

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

    public byte[] downloadEventImageWithCustomKey(String customKey) {
        String eventKey = String.format("events/%s/image.jpg", customKey);
        try {
            return downloadFile(eventKey);
        } catch (Exception e) {
            return downloadFile(DEFAULT_EVENT_IMAGE_KEY);
        }
    }

    public byte[] getEventImage(long eventId, String imageKey) {
        if (imageKey != null && !imageKey.isEmpty()) {
            return downloadEventImageWithCustomKey(imageKey);
        } else {
            return downloadEventAvatar(eventId);
        }
    }
}