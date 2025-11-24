package com.example.Back;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync; // <-- 1. IMPORTAR

import java.util.TimeZone;

@SpringBootApplication
@EnableAsync // <-- 2. ADICIONAR ISTO (Obrigatório para o EmailService não travar)
public class BackApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackApplication.class, args);
	}

	@PostConstruct
	public void init() {
		// Ótima prática! Garante que os logs e datas do banco fiquem no horário BR.
		TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
	}
}