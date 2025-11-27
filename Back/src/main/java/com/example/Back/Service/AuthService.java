package com.example.Back.Service;

import com.example.Back.Dto.AuthDTO;
import com.example.Back.Dto.RegisterDTO;
import com.example.Back.Entity.Empresa;
import com.example.Back.Entity.Usuario;
import com.example.Back.Entity.UserRole;
import com.example.Back.Repository.EmpresaRepository;
import com.example.Back.Repository.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final EmpresaRepository empresaRepository;
    private final EmailService emailService;

    public AuthService(AuthenticationManager authenticationManager, UsuarioRepository usuarioRepository, TokenService tokenService, PasswordEncoder passwordEncoder, EmpresaRepository empresaRepository, EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
        this.empresaRepository = empresaRepository;
        this.emailService = emailService;
    }

    @Transactional
    public void recuperarSenha(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("E-mail não encontrado no sistema."));

        // Gera uma senha temporária aleatória (8 caracteres)
        String novaSenha = java.util.UUID.randomUUID().toString().substring(0, 8);

        // Atualiza no banco
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);

        // --- ALTERAÇÃO AQUI: Link adicionado ---
        String linkAplicacao = "https://stockbot-front.onrender.com";

        String mensagem = "Olá,\n\nSua senha foi resetada com sucesso.\n" +
                "Sua nova senha temporária é: " + novaSenha + "\n\n" +
                "Acesse o sistema em: " + linkAplicacao + "\n\n" +
                "Por favor, faça login e troque sua senha imediatamente no menu de Configurações.";

        emailService.enviarEmailTexto(email, "Recuperação de Senha - StockBot", mensagem);
    }

    // ... (Restante dos métodos login e register permanecem iguais)
    @Transactional(readOnly = true)
    public String login(AuthDTO data) {
        Usuario usuario = usuarioRepository.findByEmail(data.email())
                .orElseThrow(() -> new RuntimeException("Este e-mail não está cadastrado."));

        if (usuario.getEmpresa() == null || !usuario.getEmpresa().getDominio().equals(data.dominioEmpresa())) {
            throw new RuntimeException("Este usuário não pertence ao domínio " + data.dominioEmpresa());
        }

        try {
            var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
            var auth = this.authenticationManager.authenticate(usernamePassword);
            return tokenService.gerarToken((Usuario) auth.getPrincipal());
        } catch (AuthenticationException e) {
            throw new RuntimeException("Senha incorreta.");
        }
    }

    @Transactional
    public void register(RegisterDTO data) {
        if (this.usuarioRepository.findByEmail(data.email()).isPresent()) {
            throw new IllegalArgumentException("Este e-mail já está em uso. Tente fazer login.");
        }

        Optional<Empresa> empresaExistente = empresaRepository.findByDominio(data.dominioEmpresa());

        if (empresaExistente.isPresent()) {
            throw new IllegalArgumentException("Domínio já registado. Peça a um administrador para criar sua conta.");
        } else {
            Empresa novaEmpresa = new Empresa();
            novaEmpresa.setDominio(data.dominioEmpresa());
            empresaRepository.save(novaEmpresa);

            Usuario novoUsuario = new Usuario();
            novoUsuario.setEmail(data.email());
            novoUsuario.setSenha(passwordEncoder.encode(data.senha()));
            novoUsuario.setRole(UserRole.ADMIN);
            novoUsuario.setEmpresa(novaEmpresa);

            this.usuarioRepository.save(novoUsuario);
        }
    }
}