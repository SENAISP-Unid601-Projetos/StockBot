package com.example.Back.config;

import com.example.Back.Entity.Usuario;
import com.example.Back.Repository.UsuarioRepository;
import com.example.Back.Service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

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

        var tokenJWT = recuperarToken(request);

        if (tokenJWT != null) {
            try {
                var subject = tokenService.getSubject(tokenJWT);
                Optional<Usuario> optionalUsuario = usuarioRepository.findByEmail(subject);

                if (optionalUsuario.isPresent()) {
                    Usuario usuario = optionalUsuario.get();

                    // --- LOGS DE DEBUG (Aparecerão no Render) ---
                    System.out.println("LOGIN DEBUG: Usuário encontrado: " + usuario.getEmail());
                    System.out.println("LOGIN DEBUG: Role no Banco: " + usuario.getRole());
                    System.out.println("LOGIN DEBUG: Autoridades geradas: " + usuario.getAuthorities());
                    // -------------------------------------------

                    var authentication = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    System.out.println("LOGIN DEBUG: Token válido, mas usuário não encontrado no banco: " + subject);
                }
            } catch (Exception e) {
                System.out.println("LOGIN DEBUG: Erro ao validar token: " + e.getMessage());
                SecurityContextHolder.clearContext();
            }
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