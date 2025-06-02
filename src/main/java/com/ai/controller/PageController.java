package com.ai.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String loadChatPage() {
        return "chat"; // This returns chat.html from resources/templates
    }
}