package com.example.Back.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    // Injetamos, mas se não tiver configurado, usamos um padrão
    @Value("${spring.mail.username:teste@stockbot.com}")
    private String remetente;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarEmailTexto(String destinatario, String assunto, String mensagem) {
        // --- MODO DESENVOLVIMENTO (SIMULAÇÃO) ---
        System.out.println("\n=================================================");
        System.out.println("📧 [EMAIL SIMULADO] - O sistema 'enviou' um e-mail:");
        System.out.println("-------------------------------------------------");
        System.out.println("DE: " + remetente);
        System.out.println("PARA: " + destinatario);
        System.out.println("ASSUNTO: " + assunto);
        System.out.println("-------------------------------------------------");
        System.out.println("MENSAGEM:\n" + mensagem);
        System.out.println("=================================================\n");

        // Tenta enviar de verdade se as configurações existirem,
        // mas NÃO TRAVA o sistema se falhar.
        try {
            // Se quiser tentar enviar de verdade, descomente as linhas abaixo:

            SimpleMailMessage email = new SimpleMailMessage();
            email.setFrom(remetente);
            email.setTo(destinatario);
            email.setSubject(assunto);
            email.setText(mensagem);
            mailSender.send(email);

        } catch (Exception e) {
            // Apenas loga o erro, mas deixa o fluxo continuar
            System.err.println("⚠️ Aviso: Não foi possível enviar o e-mail real (SMTP não configurado ou bloqueado).");
            System.err.println("O fluxo seguirá normalmente pois estamos em modo DEV.");
        }
    }
}