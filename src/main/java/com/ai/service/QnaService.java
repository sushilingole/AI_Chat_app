package com.ai.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;



@Service
public class QnaService {

	 	@Value("${gemini.api.url}")
	    private String geminiApiUrl;

	    @Value("${gemini.api.key}")
	    private String geminiApikey;


    private final WebClient webClient;

    // Inject WebClient.Builder instead of manually creating WebClient
    public QnaService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String getAnswer(String question) {
        Map<String, Object> requestBody = Map.of(
            "contents", new Object[]{
                Map.of("parts", new Object[]{ Map.of("text", question) })
            }
        );

        String response = webClient.post()
            .uri(geminiApiUrl + geminiApikey)
            .header("Content-Type", "application/json")
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(String.class)
            .block();

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(response);
            return root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error parsing response.";
        }
    }
    //Created this method for testing ...
    /*@PostConstruct
    public void init() 
    {
        System.out.println("Gemini API URL: " + geminiApiUrl);
        System.out.println("Gemini API Key: " + (geminiApikey ));
    }*/
}
