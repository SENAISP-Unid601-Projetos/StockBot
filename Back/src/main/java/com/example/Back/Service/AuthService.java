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
import java.util.Optional; // Importar Optional

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final EmpresaRepository empresaRepository;

    public AuthService(AuthenticationManager authenticationManager, UsuarioRepository usuarioRepository, TokenService tokenService, PasswordEncoder passwordEncoder, EmpresaRepository empresaRepository) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
        this.empresaRepository = empresaRepository;
    }

    @Transactional(readOnly = true)
    public String login(AuthDTO data) {
        try {
            Usuario usuario = usuarioRepository.findByEmail(data.email())
                    .orElseThrow(() -> new RuntimeException("E-mail, senha ou domínio inválidos."));

            if (usuario.getEmpresa() == null || !usuario.getEmpresa().getDominio().equals(data.dominioEmpresa())) {
                throw new RuntimeException("E-mail, senha ou domínio inválidos.");
            }

            var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
            var auth = this.authenticationManager.authenticate(usernamePassword);
            return tokenService.gerarToken((Usuario) auth.getPrincipal());

        } catch (AuthenticationException e) {
            throw new RuntimeException("E-mail, senha ou domínio inválidos.", e);
        } catch (RuntimeException e) {
            throw e;
        }
    }

    // *** MÉTODO REGISTER SEGURO ***
    @Transactional
    public void register(RegisterDTO data) {
        if (this.usuarioRepository.findByEmail(data.email()).isPresent()) {
            throw new IllegalArgumentException("E-mail já está em uso.");
        }

        // Verifica se o DOMÍNIO já existe
        Optional<Empresa> empresaExistente = empresaRepository.findByDominio(data.dominioEmpresa());

        if (empresaExistente.isPresent()) {
            // Se o domínio JÁ EXISTE, bloqueia o registo público.
            throw new IllegalArgumentException("Domínio já registado. Peça a um administrador da sua empresa para criar a sua conta.");

        } else {
            // Se o domínio é NOVO, cria a empresa E o primeiro ADMIN
            Empresa novaEmpresa = new Empresa();
            novaEmpresa.setDominio(data.dominioEmpresa());
            // (Pode adicionar nomeExibicao e corPrimaria aqui depois)
            empresaRepository.save(novaEmpresa);

            Usuario novoUsuario = new Usuario();
            novoUsuario.setEmail(data.email());
            novoUsuario.setSenha(passwordEncoder.encode(data.senha()));

            // O primeiro utilizador do domínio é automaticamente ADMIN
            novoUsuario.setRole(UserRole.ADMIN);

            novoUsuario.setEmpresa(novaEmpresa);

            this.usuarioRepository.save(novoUsuario);
        }
    }
}