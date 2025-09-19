package com.example.Back.Service;

import com.example.Back.Dto.CreateUserDTO;
import com.example.Back.Dto.PasswordChangeDTO;
import com.example.Back.Dto.UsuarioDTO;
import com.example.Back.Entity.UserRole;
import com.example.Back.Entity.Usuario;
import com.example.Back.Repository.UsuarioRepository;
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

    public List<UsuarioDTO> findAll() {
        return usuarioRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UsuarioDTO createUser(CreateUserDTO createUserDTO) {
        if (usuarioRepository.findByEmail(createUserDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Erro: E-mail já está em uso!");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setEmail(createUserDTO.getEmail());
        novoUsuario.setSenha(passwordEncoder.encode(createUserDTO.getSenha()));

        // Altere estas duas linhas para setar a role como ADMIN e pegar o domínio do DTO
        novoUsuario.setRole(UserRole.ADMIN);
        novoUsuario.setDominioEmpresa(createUserDTO.getDominioEmpresa());

        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);
        return toDTO(usuarioSalvo);
    }

    // O método changeUserRole foi removido, pois não há mais a necessidade de alterar a função do usuário.

    public void deleteUser(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Utilizador não encontrado com o id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    @Transactional
    public void changePassword(String userEmail, PasswordChangeDTO dto) {
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