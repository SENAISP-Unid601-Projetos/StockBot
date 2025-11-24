package com.example.Back.Service;

import com.example.Back.Dto.AuthDTO;
import com.example.Back.Dto.RegisterDTO;
import com.example.Back.Entity.Empresa;
import com.example.Back.Entity.Usuario;
import com.example.Back.Entity.UserRole;
import com.example.Back.Repository.EmpresaRepository;
import com.example.Back.Repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

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

    @Transactional(readOnly = true)
    public String login(AuthDTO data) {
        // 1. Normalização (Sanitização de Input)
        String emailLimpo = data.email().trim().toLowerCase();
        String dominioLimpo = data.dominioEmpresa().trim().toLowerCase();

        try {
            // 2. Busca Otimizada (O findByEmail já traz a empresa via EntityGraph)
            Usuario usuario = usuarioRepository.findByEmail(emailLimpo)
                    .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas."));

            // 3. Validação de Domínio (Case Insensitive)
            if (!usuario.getEmpresa().getDominio().equalsIgnoreCase(dominioLimpo)) {
                // Loga o erro real para o admin, mas retorna erro genérico para o usuário
                logger.warn("Tentativa de login com domínio errado. User: {}, Domínio Tentado: {}", emailLimpo, dominioLimpo);
                throw new BadCredentialsException("Credenciais inválidas.");
            }

            // 4. Autenticação Spring Security
            var usernamePassword = new UsernamePasswordAuthenticationToken(emailLimpo, data.senha());
            var auth = this.authenticationManager.authenticate(usernamePassword);

            // 5. Gera Token
            return tokenService.gerarToken((Usuario) auth.getPrincipal());

        } catch (AuthenticationException e) {
            // Captura erro de senha errada e relança mensagem genérica
            throw new BadCredentialsException("E-mail, senha ou domínio incorretos.");
        }
    }

    @Transactional
    public void register(RegisterDTO data) {
        String emailLimpo = data.email().trim().toLowerCase();
        String dominioLimpo = data.dominioEmpresa().trim().toLowerCase();

        // 1. Validação Rápida de Email (Exists é mais rápido que Find)
        if (usuarioRepository.existsByEmail(emailLimpo)) {
            throw new IllegalArgumentException("Este e-mail já está em uso.");
        }

        // 2. Validação Rápida de Domínio (IgnoreCase)
        if (empresaRepository.existsByDominioIgnoreCase(dominioLimpo)) {
            throw new IllegalArgumentException("Este domínio empresarial já está registado. Solicite acesso ao administrador.");
        }

        // 3. Criar Empresa (Usa o construtor que criamos na Entidade Empresa)
        Empresa novaEmpresa = new Empresa(dominioLimpo);
        empresaRepository.save(novaEmpresa);

        // 4. Criar Primeiro Usuário (ADMIN)
        Usuario novoUsuario = new Usuario();
        novoUsuario.setEmail(emailLimpo);
        novoUsuario.setSenha(passwordEncoder.encode(data.senha()));
        novoUsuario.setRole(UserRole.ADMIN);
        novoUsuario.setEmpresa(novaEmpresa);

        usuarioRepository.save(novoUsuario);

        logger.info("Nova empresa registrada: {}", dominioLimpo);
    }

    @Transactional
    public void recuperarSenha(String email) {
        String emailLimpo = email.trim().toLowerCase();

        // Busca segura
        Usuario usuario = usuarioRepository.findByEmail(emailLimpo)
                .orElseThrow(() -> new RuntimeException("E-mail não encontrado no sistema."));

        String novaSenha = java.util.UUID.randomUUID().toString().substring(0, 8);

        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);

        String assunto = "Recuperação de Senha - StockBot";
        String mensagem = String.format("""
                Olá,
                
                Recebemos um pedido de recuperação de senha.
                Sua nova senha temporária é: %s
                
                Acesse o sistema e troque sua senha imediatamente.
                """, novaSenha);

        // Envia o email de forma assíncrona (se o EmailService suportar @Async)
        emailService.enviarEmailTexto(emailLimpo, assunto, mensagem);
    }
}