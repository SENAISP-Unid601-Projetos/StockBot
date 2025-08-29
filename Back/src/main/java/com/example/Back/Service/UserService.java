package com.example.Back.Service;

import com.example.Back.Dto.CreateUserDTO;
import com.example.Back.Entity.Usuario;
import com.example.Back.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> listarTodosUsuarios() {
        return usuarioRepository.findAll();
    }

    public void deletarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Utilizador não encontrado com o id: " + id);
        }
        usuarioRepository.deleteById(id);
    }
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario criarUsuario(CreateUserDTO createUserDTO) {
        if (usuarioRepository.findByEmail(createUserDTO.getEmail()) != null) {
            throw new RuntimeException("Erro: E-mail já está em uso!");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setEmail(createUserDTO.getEmail());
        novoUsuario.setSenha(passwordEncoder.encode(createUserDTO.getSenha()));
        novoUsuario.setRole(createUserDTO.getRole());

        return usuarioRepository.save(novoUsuario);
    }

}
