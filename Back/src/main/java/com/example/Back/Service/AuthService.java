package com.example.Back.Service;

import com.example.Back.Dto.AuthDTO;
import com.example.Back.Dto.RegisterDTO;
import com.example.Back.Entity.Empresa; // <-- Adicionar importação
import com.example.Back.Entity.Usuario;
import com.example.Back.Entity.UserRole;
import com.example.Back.Repository.EmpresaRepository; // <-- Adicionar importação
import com.example.Back.Repository.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- Adicionar importação

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final EmpresaRepository empresaRepository; // <-- Adicionar Repositório da Empresa

    // 1. Injetar EmpresaRepository no construtor
    public AuthService(AuthenticationManager authenticationManager, UsuarioRepository usuarioRepository, TokenService tokenService, PasswordEncoder passwordEncoder, EmpresaRepository empresaRepository) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
        this.empresaRepository = empresaRepository; // <-- Atribuir aqui
    }

    // 2. Método de Login CORRIGIDO
    @Transactional(readOnly = true)
    public String login(AuthDTO data) {
        try {
            Usuario usuario = usuarioRepository.findByEmail(data.email())
                    .orElseThrow(() -> new RuntimeException("E-mail, senha ou domínio inválidos."));


            // Verifica a 'Empresa' associada ao 'Usuario', e o 'dominio' dessa 'Empresa'
            if (usuario.getEmpresa() == null || !usuario.getEmpresa().getDominio().equals(data.dominioEmpresa())) {
                throw new RuntimeException("E-mail, senha ou domínio inválidos.");
            }
            // *** FIM DA CORREÇÃO ***

            var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
            var auth = this.authenticationManager.authenticate(usernamePassword);
            return tokenService.gerarToken((Usuario) auth.getPrincipal());

        } catch (AuthenticationException e) {
            throw new RuntimeException("E-mail, senha ou domínio inválidos.", e);
        } catch (RuntimeException e) {
            throw e;
        }
    }

    // 3. Método de Registo CORRIGIDO
    @Transactional
    public void register(RegisterDTO data) {
        if (this.usuarioRepository.findByEmail(data.email()).isPresent()) {
            throw new IllegalArgumentException("E-mail já está em uso.");
        }

        // Procura ou cria a Empresa
        Empresa empresa = empresaRepository.findByDominio(data.dominioEmpresa())
                .orElseGet(() -> {
                    Empresa novaEmpresa = new Empresa();
                    novaEmpresa.setDominio(data.dominioEmpresa());
                    return empresaRepository.save(novaEmpresa);
                });

        Usuario novoUsuario = new Usuario();
        novoUsuario.setEmail(data.email());
        novoUsuario.setSenha(passwordEncoder.encode(data.senha()));

        // Define a role (ADMIN por defeito, conforme o seu UserRole.java atual)
        novoUsuario.setRole(UserRole.ADMIN);

        // *** CORREÇÃO AQUI ***
        // Associa a entidade Empresa, em vez de definir o campo String
        novoUsuario.setEmpresa(empresa);
        // *** FIM DA CORREÇÃO ***

        this.usuarioRepository.save(novoUsuario);
    }
}