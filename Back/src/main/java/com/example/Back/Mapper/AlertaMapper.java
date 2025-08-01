// src/main/java/com/example/Back/Mapper/AlertaMapper.java
package com.example.Back.Mapper;

import com.example.Back.DTO.AlertaDTO;
import com.example.Back.Entity.Alerta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface AlertaMapper {
    AlertaMapper INSTANCE = Mappers.getMapper(AlertaMapper.class);

    @Mapping(target = "usuarioResponsavelId", source = "usuarioResponsavel.id")
    @Mapping(target = "usuarioResponsavelNome", source = "usuarioResponsavel.nome")
    @Mapping(target = "usuarioResolucaoId", source = "usuarioResolucao.id")
    @Mapping(target = "usuarioResolucaoNome", source = "usuarioResolucao.nome")
    AlertaDTO toAlertaDTO(Alerta alerta);
}