package lt.techin.eventify.controller;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class SwaggerUIController {

    private static final String APPLICATION_JAVASCRIPT_VALUE = "application/javascript";
    @GetMapping(value = "/custom-swagger-ui.js", produces = APPLICATION_JAVASCRIPT_VALUE)
    @ResponseBody
    public String getCustomSwaggerScript() {
        return """
            window.onload = function() {
              window.ui = SwaggerUIBundle({
                url: "/v3/api-docs",
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                  SwaggerUIBundle.presets.apis,
                  SwaggerUIStandalonePreset
                ],
                plugins: [
                  SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                requestInterceptor: function(request) {
                  const cookies = document.cookie.split(';');
                  let jwtToken = null;
                  
                  for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.startsWith('jwt_token=')) {
                      jwtToken = cookie.substring('jwt_token='.length, cookie.length);
                      break;
                    }
                  }
                  if (jwtToken) {
                    request.headers['Authorization'] = 'Bearer ' + jwtToken;
                  }
                  
                  return request;
                }
              });
            };
            """;
    }
}
