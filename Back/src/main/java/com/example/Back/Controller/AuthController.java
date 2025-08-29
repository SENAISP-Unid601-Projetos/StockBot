package com.example.Back.Controller;

import com.example.Back.Dto.AuthDTO;
import com.example.Back.Entity.UserRole;
import com.example.Back.Entity.Usuario;
import com.example.Back.Repository.UsuarioRepository;
import com.example.Back.Service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
        if (usuarioRepository.findByEmail(novoUsuario.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Erro: E-mail já está em uso!");
        }

        // Define o cargo padrão para qualquer novo registo
        novoUsuario.setRole(UserRole.USER);

        novoUsuario.setSenha(passwordEncoder.encode(novoUsuario.getSenha()));
        usuarioRepository.save(novoUsuario);

        return ResponseEntity.ok(Map.of("message", "Utilizador registado com sucesso!"));
    }

    // --- LÓGICA DE LOGIN ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDTO authDTO) {
        // 1. Encontra o utilizador pelo e-mail
        Usuario usuario = usuarioRepository.findByEmail(authDTO.email());
        if (usuario == null) {
            return ResponseEntity.status(401).body("E-mail ou senha inválidos.");
        }

        // 2. Verifica se a senha enviada (authDTO.senha()) bate com a senha criptografada no banco (usuario.getSenha())
        if (passwordEncoder.matches(authDTO.senha(), usuario.getSenha())) {
            // 3. Se as senhas correspondem, gera o token
            String token = tokenService.gerarToken(usuario);

            // 4. Retorna o token em um objeto JSON: { "token": "seu-token-jwt-aqui" }
            return ResponseEntity.ok(Map.of("token", token));
        }

        // 5. Se as senhas não correspondem, retorna erro de não autorizado
        return ResponseEntity.status(401).body("E-mail ou senha inválidos.");
    }
}
