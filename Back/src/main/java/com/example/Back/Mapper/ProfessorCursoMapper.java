package com.example.Back.Mapper;

import com.example.Back.DTO.ProfessorCursoResponseDTO;
import com.example.Back.Entity.ProfessorCurso;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

// ProfessorCursoMapper.java
@Mapper(componentModel = "spring", uses = {ProfessorMapper.class, CursoMapper.class})
public interface ProfessorCursoMapper {
    ProfessorCursoResponseDTO toResponseDTO(ProfessorCurso entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "professor", source = "professorId")
    @Mapping(target = "curso", source = "cursoId")
    ProfessorCurso toEntity(ProfessorCursoCreatedDTO dto);
}