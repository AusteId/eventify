package lt.techin.eventify;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.security.interfaces.RSAPublicKey;

@SpringBootApplication
public class EventifyApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventifyApplication.class, args);
	}

}
