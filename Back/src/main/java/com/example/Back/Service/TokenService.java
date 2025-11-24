package com.example.Back.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.example.Back.Entity.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TokenService {

    private static final String ISSUER = "StockBot API"; // Constante para evitar erro de digitação
    private final Algorithm algorithm;

    // OTIMIZAÇÃO: Instanciamos o algoritmo UMA VEZ na inicialização
    public TokenService(@Value("${api.security.token.secret}") String jwtSecret) {
        this.algorithm = Algorithm.HMAC256(jwtSecret);
    }

    public String gerarToken(Usuario usuario) {
        try {
            List<String> roles = usuario.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            return JWT.create()
                    .withIssuer(ISSUER)
                    .withSubject(usuario.getEmail())

                    // Claims extras úteis para o Front-end
                    .withClaim("id", usuario.getId())
                    .withClaim("roles", roles)
                    .withClaim("empresaId", usuario.getEmpresa().getId()) // <-- Muito útil!
                    .withClaim("dominio", usuario.getEmpresa().getDominio()) // <-- Opcional, mas ajuda na UI

                    .withExpiresAt(gerarDataExpiracao())
                    .sign(algorithm); // Usa a instância criada no construtor
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }
    }

    public String getSubject(String token) {
        try {
            return JWT.require(algorithm) // Usa a instância criada no construtor
                    .withIssuer(ISSUER)
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            throw new RuntimeException("Token JWT inválido ou expirado!");
        }
    }

    // Helper para data de expiração (UTC é o padrão seguro para Web)
    private Instant gerarDataExpiracao() {
        // Define 2 horas a partir de AGORA, independente de onde o servidor esteja rodando
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
        // DICA: Se quiser ser 100% global, use Instant.now().plus(2, ChronoUnit.HOURS);
        // Mas mantive o seu -03:00 para garantir que bata com o horário de Brasília se for requisito.
    }
}