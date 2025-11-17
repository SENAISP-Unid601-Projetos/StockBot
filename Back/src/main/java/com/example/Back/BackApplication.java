package com.example.Back;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class BackApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackApplication.class, args);
	}

	@PostConstruct
	public void init() {
		// Define o fuso horário padrão da aplicação para Brasília (GMT-3)
		// Isso garante que o LocalDateTime.now() pegue a hora correta,
		// mesmo que o servidor esteja em outro país (ex: Ohio/EUA).
		TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
	}
}