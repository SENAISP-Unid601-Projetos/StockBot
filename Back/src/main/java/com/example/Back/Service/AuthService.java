package com.example.Back.Service;

import com.example.Back.Dto.AuthDTO;
import com.example.Back.Dto.RegisterDTO;
import com.example.Back.Entity.Usuario;
import com.example.Back.Repository.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager, UsuarioRepository usuarioRepository, TokenService tokenService, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
    }

    public String login(AuthDTO data) {
        try {
            var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
            var auth = this.authenticationManager.authenticate(usernamePassword);
            return tokenService.gerarToken((Usuario) auth.getPrincipal());
        } catch (AuthenticationException e) {
            throw new RuntimeException("Falha na autenticação: e-mail ou senha inválidos.", e);
        }
    }

    public void register(RegisterDTO data) {
        if (this.usuarioRepository.findByEmail(data.email()).isPresent()) {
            throw new IllegalArgumentException("E-mail já está em uso.");
        }
        Usuario novoUsuario = new Usuario();
        novoUsuario.setEmail(data.email());
        novoUsuario.setSenha(passwordEncoder.encode(data.senha()));
        novoUsuario.setRole(data.role());
        this.usuarioRepository.save(novoUsuario);
    }
}
