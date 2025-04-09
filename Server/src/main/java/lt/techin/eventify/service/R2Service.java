package lt.techin.eventify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
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
    @Autowired
    private S3Client s3Client;

    @Value("${r2.bucketName}")
    private String bucketName;

    public void uploadEventImage(MultipartFile file, long eventId) throws IOException {
        if (file == null || file.isEmpty()) {
            return;
        }

        // Convert the uploaded file to JPG
        InputStream inputStream = file.getInputStream();
        BufferedImage originalImage = ImageIO.read(inputStream);
        if (originalImage == null) {
            throw new IOException("Could not read the uploaded image file.");
        }

        // Create a new BufferedImage with RGB type to ensure compatibility with JPG
        BufferedImage jpgImage = new BufferedImage(
                originalImage.getWidth(),
                originalImage.getHeight(),
                BufferedImage.TYPE_INT_RGB
        );
        jpgImage.createGraphics().drawImage(originalImage, 0, 0, null);

        // Convert the image to JPG format in a byte array
        ByteArrayOutputStream jpgOutputStream = new ByteArrayOutputStream();
        ImageIO.write(jpgImage, "jpg", jpgOutputStream);
        byte[] jpgBytes = jpgOutputStream.toByteArray();

        // Define the S3 key and upload
        String key = String.format("events/%s/image.jpg", eventId); // Always save as image.jpg

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(jpgBytes));
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
}
