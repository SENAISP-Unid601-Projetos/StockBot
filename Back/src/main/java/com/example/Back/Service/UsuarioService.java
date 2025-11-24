package com.example.Back.Service;

import com.example.Back.Dto.CreateUserDTO;
import com.example.Back.Dto.PasswordChangeDTO;
import com.example.Back.Dto.UsuarioDTO;
import com.example.Back.Entity.Empresa;
import com.example.Back.Entity.Usuario;
import com.example.Back.Repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public Empresa getEmpresaDoUsuarioAutenticado() {
        String usuarioEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        // Aqui o findByEmail já usa @EntityGraph, então é super rápido e já traz a empresa
        Usuario usuario = usuarioRepository.findByEmail(usuarioEmail)
                .orElseThrow(() -> new RuntimeException("Utilizador autenticado não encontrado."));

        if (usuario.getEmpresa() == null) {
            throw new RuntimeException("Utilizador autenticado não possui empresa associada.");
        }
        return usuario.getEmpresa();
    }

    // --- CORREÇÃO: Mudamos de List para Page ---
    @Transactional(readOnly = true)
    public Page<UsuarioDTO> findAll(Pageable pageable) {
        Empresa empresaDoAdmin = getEmpresaDoUsuarioAutenticado();

        // O repositório já devolve a página certa daquela empresa
        Page<Usuario> usuariosPage = usuarioRepository.findAllByEmpresaId(empresaDoAdmin.getId(), pageable);

        // Convertendo Page<Entity> para Page<DTO>
        return usuariosPage.map(this::toDTO);
    }

    @Transactional
    public UsuarioDTO createUser(CreateUserDTO createUserDTO) {
        if (usuarioRepository.existsByEmail(createUserDTO.getEmail())) {
            throw new IllegalArgumentException("Erro: E-mail já está em uso!");
        }

        Empresa empresaDoAdmin = getEmpresaDoUsuarioAutenticado();

        Usuario novoUsuario = new Usuario();
        novoUsuario.setEmail(createUserDTO.getEmail());
        novoUsuario.setSenha(passwordEncoder.encode(createUserDTO.getSenha()));
        novoUsuario.setRole(createUserDTO.getRole());
        novoUsuario.setEmpresa(empresaDoAdmin);

        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);
        return toDTO(usuarioSalvo);
    }

    @Transactional
    public void deleteUser(Long id) {
        Empresa empresaDoAdmin = getEmpresaDoUsuarioAutenticado();
        String emailLogado = SecurityContextHolder.getContext().getAuthentication().getName();

        // 1. Busca Segura (ID + Empresa)
        Usuario usuarioParaApagar = usuarioRepository.findByIdAndEmpresaId(id, empresaDoAdmin.getId())
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado ou não pertence a esta empresa."));

        // 2. Trava de Segurança (Anti-Suicídio)
        if (usuarioParaApagar.getEmail().equals(emailLogado)) {
            throw new IllegalArgumentException("Você não pode excluir sua própria conta enquanto está logado.");
        }

        usuarioRepository.delete(usuarioParaApagar);
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