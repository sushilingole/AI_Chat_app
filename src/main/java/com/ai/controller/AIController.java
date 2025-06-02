package com.ai.controller;

import java.util.Map;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ai.service.QnaService;

//import lombok.AllArgsConstructor;



@RestController
@RequestMapping("api/qna")
public class AIController {

    private final QnaService qnaService;

    public AIController(QnaService qnaService) {
        this.qnaService = qnaService;
    }

    @PostMapping("/ask")
    public ResponseEntity<String> askQuestion(@RequestBody Map<String, String> payload) {
        String question = payload.get("question");
        String answer = qnaService.getAnswer(question);
        return ResponseEntity.ok(answer);
    }
    
    
}
