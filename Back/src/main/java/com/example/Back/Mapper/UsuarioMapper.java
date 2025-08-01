package com.example.Back.Mapper;

import com.example.Back.DTO.UsuarioDTO;
import com.example.Back.Entity.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    UsuarioMapper INSTANCE = Mappers.getMapper(UsuarioMapper.class);

    UsuarioDTO toUsuarioDTO(Usuario usuario);
    Usuario fromUsuarioEntity(UsuarioDTO usuarioDTO);

    // Método para converter id em Usuario (para uso em outros mappers)
    default Usuario fromId(Long id) {
        if (id == null) {
            return null;
        }
        Usuario usuario = new Usuario();
        usuario.setId(id);
        return usuario;
    }
}
