package com.example.Back.Mapper;

import com.example.Back.DTO.ProfessorDTO;
import com.example.Back.Entity.Professor;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
@Mapper(componentModel = "spring")
public interface ProfessorMapper {
        ProfessorMapper INSTANCE = Mappers.getMapper(ProfessorMapper.class);

        ProfessorDTO toProfessorDTO(Professor professor);
        Professor fromProfessorEntity(ProfessorDTO professorDTO);

    }
