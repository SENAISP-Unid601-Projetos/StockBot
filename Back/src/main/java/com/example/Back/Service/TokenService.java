package com.example.Back.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.example.Back.Entity.Usuario;
import org.springframework.beans.factory.annotation.Value; // <-- IMPORTAR
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TokenService {

    // 1. Remove o segredo "hardcoded"
    // private final String JWT_SECRET = "...";

    // 2. Cria uma variável final para o segredo
    private final String jwtSecret;

    // 3. Injeta o segredo do application.properties pelo construtor
    public TokenService(@Value("${api.security.token.secret}") String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    public String gerarToken(Usuario usuario) {
        List<String> roles = usuario.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return JWT.create()
                .withIssuer("StockBot API")
                .withSubject(usuario.getEmail())
                .withClaim("id", usuario.getId())
                .withClaim("roles", roles)
                .withExpiresAt(LocalDateTime.now()
                        .plusHours(2)
                        .toInstant(ZoneOffset.of("-03:00"))
                )
                // 4. Usa a variável injetada
                .sign(Algorithm.HMAC256(jwtSecret));
    }

    public String getSubject(String token) {
        return JWT.require(Algorithm.HMAC256(jwtSecret)) // 5. Usa a variável injetada
                .withIssuer("StockBot API")
                .build()
                .verify(token)
                .getSubject();
    }
}