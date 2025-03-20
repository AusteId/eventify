package lt.techin.eventify.util;

import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

public class WebUtils {

    public static URI uriLocation(String path,String id) {
       return ServletUriComponentsBuilder.fromCurrentContextPath()
               .path(path)
               .buildAndExpand(id)
               .toUri();
    }
}
