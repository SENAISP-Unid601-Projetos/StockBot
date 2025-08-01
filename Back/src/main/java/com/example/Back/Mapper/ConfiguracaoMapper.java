package com.example.Back.Mapper;

import com.example.Back.DTO.ConfiguracaoCreateDTO;
import com.example.Back.DTO.ConfiguracaoResponseDTO;
import com.example.Back.DTO.ConfiguracaoUpdateDTO;
import com.example.Back.Entity.Configuracao;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ConfiguracaoMapper {

    Configuracao toEntity(ConfiguracaoCreateDTO dto);

    ConfiguracaoResponseDTO toResponseDTO(Configuracao entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromUpdateDTO(ConfiguracaoUpdateDTO dto, @MappingTarget Configuracao entity);
}