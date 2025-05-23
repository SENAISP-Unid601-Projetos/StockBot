package com.example.Back.Service;

import com.example.Back.DTO.UsuarioDTO;
import com.example.Back.Mapper.UsuarioMapper;
import com.example.Back.Entity.Usuario;
import com.example.Back.Repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private  final UsuarioMapper usuarioMapper;

    public UsuarioService(UsuarioRepository usuarioRepository, UsuarioMapper usuarioMapper) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
    }

    public List<UsuarioDTO> getAll() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                .map(usuarioMapper::toUsuarioDTO)
                .collect(Collectors.toList());
    }
}
