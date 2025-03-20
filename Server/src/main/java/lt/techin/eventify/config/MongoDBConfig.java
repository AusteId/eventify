package lt.techin.eventify.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "lt.techin.eventify.repository.mongodb")
public class MongoDBConfig {
}
