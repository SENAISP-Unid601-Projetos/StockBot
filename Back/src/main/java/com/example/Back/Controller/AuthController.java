package com.example.Back.Controller;

import com.example.Back.Dto.AuthDTO;
import com.example.Back.Dto.PasswordVerificationDTO;
import com.example.Back.Entity.UserRole;
import com.example.Back.Entity.Usuario;
import com.example.Back.Repository.UsuarioRepository;
import com.example.Back.Service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional; // Importe o Optional se ainda não estiver

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Usuario novoUsuario) {
        // CORREÇÃO AQUI: Usamos .isPresent() para verificar se a "caixa" tem algo dentro
        if (usuarioRepository.findByEmail(novoUsuario.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Erro: E-mail já está em uso!"));
        }

        novoUsuario.setRole(UserRole.USER);
        novoUsuario.setSenha(passwordEncoder.encode(novoUsuario.getSenha()));
        usuarioRepository.save(novoUsuario);

        return ResponseEntity.ok(Map.of("message", "Utilizador registado com sucesso!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDTO authDTO) {
        // CORREÇÃO AQUI: Primeiro, pegamos a "caixa" (Optional)
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(authDTO.email());

        // Verificamos se a "caixa" está vazia
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(401).body("E-mail ou senha inválidos.");
        }

        // Se não está vazia, abrimos a "caixa" para pegar o utilizador
        Usuario usuario = usuarioOpt.get();

        if (passwordEncoder.matches(authDTO.senha(), usuario.getSenha())) {
            String token = tokenService.gerarToken(usuario);
            return ResponseEntity.ok(Map.of("token", token));
        }

        return ResponseEntity.status(401).body("E-mail ou senha inválidos.");
    }

    @PostMapping("/verify-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> verifyPassword(@RequestBody PasswordVerificationDTO dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Este método já estava correto
        Usuario usuario = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (passwordEncoder.matches(dto.getPassword(), usuario.getSenha())) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(401).build();
        }
    }
}
