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
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Usuario novoUsuario) {
        logger.info("📝 POST /api/auth/register - Tentativa de registro");
        logger.debug("📦 Dados do novo usuário: {}", novoUsuario);
        logger.debug("📧 Email do novo usuário: {}", novoUsuario.getEmail());

        // CORREÇÃO AQUI: Usamos .isPresent() para verificar se a "caixa" tem algo dentro
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(novoUsuario.getEmail());
        logger.debug("🔍 Verificando se email já existe: {}", usuarioExistente.isPresent());

        if (usuarioExistente.isPresent()) {
            logger.warn("❌ POST /api/auth/register - Email já em uso: {}", novoUsuario.getEmail());
            return ResponseEntity.badRequest().body(Map.of("message", "Erro: E-mail já está em uso!"));
        }

        try {
            novoUsuario.setRole(UserRole.USER);
            logger.debug("👤 Role definida como: {}", UserRole.USER);

            String senhaOriginal = novoUsuario.getSenha();
            novoUsuario.setSenha(passwordEncoder.encode(novoUsuario.getSenha()));
            logger.debug("🔐 Senha codificada com sucesso");
            logger.debug("📋 Senha original: {}, Senha codificada: {}", senhaOriginal, novoUsuario.getSenha());

            usuarioRepository.save(novoUsuario);
            logger.info("✅ POST /api/auth/register - Usuário registrado com sucesso: {}", novoUsuario.getEmail());
            logger.debug("📊 ID do usuário criado: {}", novoUsuario.getId());

            return ResponseEntity.ok(Map.of("message", "Utilizador registado com sucesso!"));
        } catch (Exception e) {
            logger.error("❌ POST /api/auth/register - Erro ao registrar usuário: {}", e.getMessage());
            logger.debug("🔧 Stack trace: ", e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Erro interno no servidor"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDTO authDTO) {
        logger.info("🔐 POST /api/auth/login - Tentativa de login");
        logger.debug("📧 Email tentado: {}", authDTO.email());
        logger.debug("📋 Dados de login: {}", authDTO);

        // CORREÇÃO AQUI: Primeiro, pegamos a "caixa" (Optional)
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(authDTO.email());
        logger.debug("🔍 Usuário encontrado no banco: {}", usuarioOpt.isPresent());

        // Verificamos se a "caixa" está vazia
        if (usuarioOpt.isEmpty()) {
            logger.warn("❌ POST /api/auth/login - Email não encontrado: {}", authDTO.email());
            return ResponseEntity.status(401).body("E-mail ou senha inválidos.");
        }

        // Se não está vazia, abrimos a "caixa" para pegar o utilizador
        Usuario usuario = usuarioOpt.get();
        logger.debug("👤 Usuário recuperado: {}", usuario.getEmail());
        logger.debug("🔐 Verificando senha...");

        if (passwordEncoder.matches(authDTO.senha(), usuario.getSenha())) {
            logger.debug("✅ Senha válida");
            String token = tokenService.gerarToken(usuario);
            logger.info("✅ POST /api/auth/login - Login bem-sucedido para: {}", authDTO.email());
            logger.debug("🔑 Token gerado: {}", token.substring(0, 50) + "..."); // Log parcial do token por segurança

            return ResponseEntity.ok(Map.of("token", token));
        }

        logger.warn("❌ POST /api/auth/login - Senha inválida para: {}", authDTO.email());
        return ResponseEntity.status(401).body("E-mail ou senha inválidos.");
    }

    @PostMapping("/verify-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> verifyPassword(@RequestBody PasswordVerificationDTO dto) {
        logger.info("🔐 POST /api/auth/verify-password - Verificação de senha admin");
        logger.debug("📦 Dados recebidos: {}", dto);

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.debug("👤 Usuário autenticado: {}", username);

        try {
            // Este método já estava correto
            Usuario usuario = usuarioRepository.findByEmail(username)
                    .orElseThrow(() -> {
                        logger.error("❌ POST /api/auth/verify-password - Usuário não encontrado: {}", username);
                        return new RuntimeException("Usuário não encontrado");
                    });

            logger.debug("🔍 Verificando senha do usuário: {}", usuario.getEmail());
            boolean senhaCorreta = passwordEncoder.matches(dto.getPassword(), usuario.getSenha());
            logger.debug("🔐 Resultado da verificação: {}", senhaCorreta ? "CORRETA" : "INCORRETA");

            if (senhaCorreta) {
                logger.info("✅ POST /api/auth/verify-password - Senha verificada com sucesso para: {}", username);
                return ResponseEntity.ok().build();
            } else {
                logger.warn("❌ POST /api/auth/verify-password - Senha incorreta para: {}", username);
                return ResponseEntity.status(401).build();
            }
        } catch (Exception e) {
            logger.error("❌ POST /api/auth/verify-password - Erro na verificação: {}", e.getMessage());
            logger.debug("🔧 Stack trace: ", e);
            return ResponseEntity.status(500).build();
        }
    }


    private String safeLog(Object object) {
        if (object == null) return "null";
        String str = object.toString();
        if (str.length() > 100) {
            return str.substring(0, 100) + "...";
        }
        return str;
    }
}