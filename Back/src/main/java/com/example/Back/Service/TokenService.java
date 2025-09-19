package com.example.Back.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.example.Back.Entity.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TokenService {

    private final String JWT_SECRET = "sua-chave-secreta-super-longa-e-dificil-de-adivinhar";

    public String gerarToken(Usuario usuario) {
        // MUDANÇA: Extrai as permissões (roles) do utilizador
        List<String> roles = usuario.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return JWT.create()
                .withIssuer("StockBot API")
                .withSubject(usuario.getEmail())
                .withClaim("id", usuario.getId())
                .withClaim("roles", roles) // <-- ADICIONA AS ROLES AO TOKEN
                .withExpiresAt(LocalDateTime.now()
                        .plusHours(2)
                        .toInstant(ZoneOffset.of("-03:00"))
                )
                .sign(Algorithm.HMAC256(JWT_SECRET));
    }

    public String getSubject(String token) {
        return JWT.require(Algorithm.HMAC256(JWT_SECRET))
                .withIssuer("StockBot API")
                .build()
                .verify(token)
                .getSubject();
    }
}
