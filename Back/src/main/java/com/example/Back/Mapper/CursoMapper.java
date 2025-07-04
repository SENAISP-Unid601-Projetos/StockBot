// CursoMapper.java
package com.example.Back.Mapper;

import com.example.Back.DTO.CursoCreateDTO;
import com.example.Back.DTO.CursoResponseDTO;
import com.example.Back.Entity.Curso;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CursoMapper {
    CursoResponseDTO toResponseDTO(Curso curso);
    Curso toEntity(CursoCreateDTO cursoCreateDTO);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateCursoFromCreateDTO(CursoCreateDTO dto, @MappingTarget Curso entity);

    // Método para converter id em Curso (usado pelo ProfessorCursoMapper)
    default Curso fromId(Long id) {
        if (id == null) {
            return null;
        }
        Curso curso = new Curso();
        curso.setIdCurso(id);
        return curso;
    }
}
