package com.example.Back.DTO;

import com.example.Back.Entity.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    UsuarioMapper INSTANCE = Mappers.getMapper(UsuarioMapper.class);

    UsuarioDTO toUsuarioDTO(Usuario usuario);
    Usuario fromUsuarioEntity(UsuarioDTO usuarioDTO);

}
