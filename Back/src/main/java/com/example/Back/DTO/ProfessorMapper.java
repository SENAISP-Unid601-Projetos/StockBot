package com.example.Back.DTO;

import com.example.Back.Entity.Professor;
import com.example.Back.Entity.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
@Mapper(componentModel = "spring")
public interface ProfessorMapper {
        ProfessorMapper INSTANCE = Mappers.getMapper(ProfessorMapper.class);

        ProfessorDTO toProfessorDTO(Professor professor);
        Professor fromProfessorEntity(ProfessorDTO professorDTO);

    }
