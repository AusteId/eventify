package lt.techin.eventify.config;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.ResourceTransformer;
import org.springframework.web.servlet.resource.ResourceTransformerChain;
import org.springframework.web.servlet.resource.TransformedResource;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

@Configuration
public class SwaggerConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/swagger-ui/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/swagger-ui/4.15.5/")
                .resourceChain(false)
                .addTransformer(new SwaggerIndexTransformer());
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/swagger-ui/")
                .setViewName("forward:/swagger-ui/index.html");
    }

    private static class SwaggerIndexTransformer implements ResourceTransformer {
        @Override
        public Resource transform(HttpServletRequest request, Resource resource, ResourceTransformerChain transformerChain) throws IOException {
            if (resource.getFilename().equals("index.html")) {
                try (InputStream is = resource.getInputStream();
                     Scanner scanner = new Scanner(is, StandardCharsets.UTF_8.name())) {
                    String html = scanner.useDelimiter("\\A").next();
                    html = html.replace("window.onload = function() {", "window.onload = function() { /* Replaced by custom config */ ");
                    String customScript = "<script src=\"/custom-swagger-ui.js\"></script>";
                    html = html.replace("</body>", customScript + "</body>");

                    return new TransformedResource(resource,html.getBytes(StandardCharsets.UTF_8));
                }
            }
            return transformerChain.transform(request,resource);
        }
    }
}
