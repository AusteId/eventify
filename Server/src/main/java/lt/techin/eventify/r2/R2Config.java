package lt.techin.eventify.r2;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

import java.net.URI;

@Configuration
public class R2Config {
    @Value("${r2.accessKeyId}")
    private String accessKeyId;

    @Value("${r2.secretAccessKey}")
    private String secretAccessKey;

    @Value("${r2.endpointUrl}")
    private String endpointUrl;

    @Value("${r2.region}")
    private String region; // Usually "auto" for R2, but in 2.x you might need a specific region

    @Bean
    public S3Client s3Client() {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKeyId, secretAccessKey);

        return S3Client.builder()
                .endpointOverride(URI.create(endpointUrl))
                .region(Region.of(region)) // You might need to choose a specific AWS region (e.g., AWS_GLOBAL)
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(true).build()) // Important for R2
                .build();
    }
}
