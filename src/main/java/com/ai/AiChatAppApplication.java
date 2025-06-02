package com.ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication(scanBasePackages = "com.ai")
@ComponentScan
public class AiChatAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiChatAppApplication.class, args);
	}

}
