
package com.example.Back.config;

import com.example.Back.Repository.UsuarioRepository;
import com.example.Back.Service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UsuarioRepository usuarioRepository;

    public SecurityFilter(TokenService tokenService, UsuarioRepository usuarioRepository) {
        this.tokenService = tokenService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // LOG 1: Avisa que o filtro foi acionado
        System.out.println("\n--- [DEBUG] Filtro de Segurança Ativado para a Rota: " + request.getRequestURI());

        var tokenJWT = recuperarToken(request);

        if (tokenJWT != null) {
            // LOG 2: Confirma que um token foi encontrado
            System.out.println("[DEBUG] Token JWT encontrado no cabeçalho.");
            try {
                var subject = tokenService.getSubject(tokenJWT);
                // LOG 3: Mostra o e-mail que foi extraído do token
                System.out.println("[DEBUG] Subject (email) extraído do token: " + subject);

                UserDetails usuario = usuarioRepository.findByEmail(subject);
                // LOG 4: Mostra o resultado da busca no banco de dados
                System.out.println("[DEBUG] Resultado da busca no banco: " + (usuario != null ? usuario.getUsername() : "NULO"));

                if (usuario != null) {
                    var authentication = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    // LOG 5: Confirma que o usuário foi autenticado com sucesso
                    System.out.println("[DEBUG] Usuário AUTENTICADO com sucesso no contexto de segurança.");
                } else {
                    // LOG 6: Avisa que o usuário do token não existe mais no banco
                    System.out.println("[DEBUG] AVISO: Token válido, mas o usuário '" + subject + "' não foi encontrado no banco.");
                }
            } catch (Exception e) {
                // LOG 7: Captura qualquer erro durante a validação do token
                System.out.println("[DEBUG] ERRO: Falha ao validar o token. Motivo: " + e.getMessage());
            }
        } else {
            // LOG 8: Avisa que a requisição veio sem token
            System.out.println("[DEBUG] Nenhum token JWT encontrado no cabeçalho 'Authorization'.");
        }

        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        var authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null) {
            return authorizationHeader.replace("Bearer ", "");
        }
        return null;
    }
}
