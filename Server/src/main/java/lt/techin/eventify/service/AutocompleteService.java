package lt.techin.eventify.service;

import lt.techin.eventify.dto.event.AutocompleteResponse;
import lt.techin.eventify.exception.AutocompleteException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AutocompleteService {

  private final RestTemplate restTemplate;

  @Value("${GEOAPIFY_API_KEY}")
  private String geoapifyApiKey;

  public AutocompleteService(RestTemplate restTemplate) {
    this.restTemplate = restTemplate;
  }

  public List<AutocompleteResponse> getAutocompleteSuggestions(String query) {

    if (query == null || query.trim().isEmpty()) {
      throw new AutocompleteException("Autocomplete query cannot be empty");
    }

    String url = String.format("https://api.geoapify.com/v1/geocode/autocomplete?text=%s&filter=countrycode:lt&lang=lt&limit=5&apiKey=%s", query, geoapifyApiKey);

    Map<String, Object> response;
    try {
      response = restTemplate.getForObject(url, Map.class);
    } catch (RestClientException e) {
      throw new AutocompleteException("Failed to fetch autocomplete suggestions from Geoapify API", e);
    }

    if (response == null || !response.containsKey("features")) {
      throw new AutocompleteException("Invalid response from Geoapify API: no suggestions found");
    }

    List<Map<String, Object>> features = (List<Map<String, Object>>) response.get("features");

    Map<String, AutocompleteResponse> uniqueSuggestions = new HashMap<>();

    for (Map<String, Object> feature : features) {
      Map<String, Object> properties = (Map<String, Object>) feature.get("properties");

      String street = (String) properties.getOrDefault("street", "");
      String houseNumber = (String) properties.getOrDefault("housenumber", "");
      String city = (String) properties.getOrDefault("city", "");
      String formatted = (String) properties.getOrDefault("formatted", "");

      formatted = formatted.replaceAll(",\\s*\\d{5}\\s*", ", ");

      String key = street + "-" + houseNumber + "-" + city;
      if (!uniqueSuggestions.containsKey(key)) {
        uniqueSuggestions.put(key, new AutocompleteResponse(street, houseNumber, city, formatted));
      }
    }

    return new ArrayList<>(uniqueSuggestions.values()).stream()
            .limit(5)
            .toList();
  }
}
