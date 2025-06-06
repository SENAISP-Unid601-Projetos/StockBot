package com.example.Back.Mapper;

import com.example.Back.DTO.ProfessorDTO;
import com.example.Back.Entity.Professor;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ProfessorMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "nome", source = "usuario.nome")
    @Mapping(target = "cpf", source = "cpf")
    @Mapping(target = "titulacao", source = "titulacao")
    @Mapping(target = "area_especializacao", source = "area_especializacao")
    @Mapping(target = "data_nascimento", source = "data_nascimento")
    ProfessorDTO toProfessorDTO(Professor professor);

    @Mapping(target = "usuario.nome", source = "nome")
    @Mapping(target = "cpf", source = "cpf")
    @Mapping(target = "titulacao", source = "titulacao")
    @Mapping(target = "area_especializacao", source = "area_especializacao")
    @Mapping(target = "data_nascimento", source = "data_nascimento")
    Professor toProfessorEntity(ProfessorDTO professorDTO);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateProfessorFromDTO(ProfessorDTO dto, @MappingTarget Professor entity);
}