package lt.techin.eventify.util;

import org.ocpsoft.prettytime.PrettyTime;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;

public class TimeConverter {

    public String convert(LocalDateTime createdAt) {
        String relativeTime = "Unknown time";

        if (createdAt != null) {

            ZoneId lithuaniaZone = ZoneId.of("Europe/Vilnius");
            ZonedDateTime lithuaniaTime = createdAt.atZone(ZoneOffset.UTC)
                    .withZoneSameInstant(lithuaniaZone);

            PrettyTime prettyTime = new PrettyTime();
            relativeTime = prettyTime.format(lithuaniaTime.toLocalDateTime());

            return relativeTime;
        }
        return "Invalid time";
    }
}
