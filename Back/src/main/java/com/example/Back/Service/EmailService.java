package com.example.Back.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:no-reply@stockbot.com}")
    private String remetente;

    // Flag para controlar se envia de verdade ou só simula (definir no application.properties)
    @Value("${api.email.enabled:false}")
    private boolean emailEnabled;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * O @Async garante que o controller não fique esperando o envio do e-mail.
     * O usuário recebe a resposta da API imediatamente.
     */
    @Async
    public void enviarEmailTexto(String destinatario, String assunto, String mensagem) {

        if (!emailEnabled) {
            logarSimulacao(destinatario, assunto, mensagem);
            return;
        }

        try {
            logger.info("Tentando enviar e-mail para: {}", destinatario);

            // Se quiser tentar enviar de verdade, descomente as linhas abaixo:

            SimpleMailMessage email = new SimpleMailMessage();
            email.setFrom(remetente);
            email.setTo(destinatario);
            email.setSubject(assunto);
            email.setText(mensagem);

            mailSender.send(email);

            logger.info("E-mail enviado com sucesso para: {}", destinatario);


        } catch (Exception e) {
            logger.error("Falha ao enviar e-mail para {}: {}", destinatario, e.getMessage());
            // Como é assíncrono, não lançamos exceção para não quebrar threads silenciosas,
            // apenas logamos o erro.
        }
    }

    private void logarSimulacao(String destinatario, String assunto, String mensagem) {
        logger.warn("--- [MODO SIMULAÇÃO] E-mail não enviado (api.email.enabled=false) ---");
        logger.info("PARA: {}", destinatario);
        logger.info("ASSUNTO: {}", assunto);
        logger.info("CORPO: \n{}", mensagem);
        logger.warn("--------------------------------------------------------------------");
    }
}