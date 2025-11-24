package com.example.Back.Service;

import com.example.Back.Dto.CreateUserDTO;
import com.example.Back.Dto.PasswordChangeDTO;
import com.example.Back.Dto.UsuarioDTO;
import com.example.Back.Entity.Empresa; // <-- Importar Empresa
import com.example.Back.Entity.UserRole;
import com.example.Back.Entity.Usuario;
import com.example.Back.Repository.UsuarioRepository;
import org.springframework.security.core.context.SecurityContextHolder; // <-- Importar SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Método HELPER para obter a empresa do usuário logado
    // Este método será usado por outros serviços (ComponenteService, HistoricoService)
    @Transactional(readOnly = true)
    public Empresa getEmpresaDoUsuarioAutenticado() {
        String usuarioEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(usuarioEmail)
                .orElseThrow(() -> new RuntimeException("Utilizador autenticado não encontrado."));
        if (usuario.getEmpresa() == null) {
            throw new RuntimeException("Utilizador autenticado não possui empresa associada.");
        }
        return usuario.getEmpresa();
    }

    // CORRIGIDO: Agora filtra pela empresa do Admin
    @Transactional(readOnly = true)
    public List<UsuarioDTO> findAll() {
        Empresa empresaDoAdmin = getEmpresaDoUsuarioAutenticado();

        return usuarioRepository.findAllByEmpresaId(empresaDoAdmin.getId()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // CORRIGIDO: Agora associa a empresa do Admin ao novo usuário
    @Transactional
    public UsuarioDTO createUser(CreateUserDTO createUserDTO) {
        if (usuarioRepository.findByEmail(createUserDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Erro: E-mail já está em uso!");
        }

        // Pega a empresa do Admin que está a criar o novo usuário
        Empresa empresaDoAdmin = getEmpresaDoUsuarioAutenticado();

        Usuario novoUsuario = new Usuario();
        novoUsuario.setEmail(createUserDTO.getEmail());
        novoUsuario.setSenha(passwordEncoder.encode(createUserDTO.getSenha()));

        // Define a role (ADMIN ou USER) vinda do DTO
        // Certifique-se que o CreateUserDTO tem o campo 'role' (como definimos na outra conversa)
        novoUsuario.setRole(createUserDTO.getRole());

        // Associa o novo usuário à MESMA empresa do Admin
        novoUsuario.setEmpresa(empresaDoAdmin);

        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);
        return toDTO(usuarioSalvo);
    }

    // CORRIGIDO: Agora só permite apagar usuários da própria empresa
    @Transactional
    public void deleteUser(Long id) {
        Empresa empresaDoAdmin = getEmpresaDoUsuarioAutenticado();

        // Verifica se o usuário a ser apagado existe E pertence à empresa do admin
        Usuario usuarioParaApagar = usuarioRepository.findByIdAndEmpresaId(id, empresaDoAdmin.getId())
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado ou não pertence a esta empresa."));

        // TODO: Adicionar lógica para não deixar o admin apagar a si mesmo (ex: if (usuarioParaApagar.getEmail().equals(SecurityContextHolder.getContext().getAuthentication().getName())))

        usuarioRepository.delete(usuarioParaApagar);
    }

    @Transactional
    public void changePassword(String userEmail, PasswordChangeDTO dto) {
        // Esta lógica permanece a mesma, pois o 'userEmail' já é o do usuário autenticado
        Usuario usuario = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado."));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), usuario.getSenha())) {
            throw new IllegalArgumentException("A senha atual está incorreta.");
        }
        if (dto.getNewPassword() == null || dto.getNewPassword().length() < 6) {
            throw new IllegalArgumentException("A nova senha deve ter no mínimo 6 caracteres.");
        }

        usuario.setSenha(passwordEncoder.encode(dto.getNewPassword()));
        usuarioRepository.save(usuario);
    }

    private UsuarioDTO toDTO(Usuario usuario) {
        return new UsuarioDTO(usuario.getId(), usuario.getEmail(), usuario.getRole());
    }
}