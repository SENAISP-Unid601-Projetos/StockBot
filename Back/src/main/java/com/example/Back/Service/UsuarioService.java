package com.example.Back.Service;

import com.example.Back.Dto.CreateUserDTO;
import com.example.Back.Dto.UserResponseDTO;
import com.example.Back.Entity.Usuario;
import com.example.Back.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Retorna uma LISTA DE DTOs
    public List<UserResponseDTO> listarTodosUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(UserResponseDTO::new) // Converte cada Usuario para UserResponseDTO
                .collect(Collectors.toList());
    }

    public void deletarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    @Transactional
    public UserResponseDTO criarUsuario(CreateUserDTO dto) {
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Erro: E-mail já está em uso!");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setEmail(dto.getEmail());
        novoUsuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        novoUsuario.setRole(dto.getRole());

        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        // Retorna o DTO do novo utilizador
        return new UserResponseDTO(usuarioSalvo);
    }
}
