package com.example.Back.Mapper;

import com.example.Back.DTO.ProfessorDTO;
import com.example.Back.Entity.Professor;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ProfessorMapper {

//    @Mapping(target = "id", source = "id")
//    @Mapping(target = "nome", source = "nome")
//    @Mapping(target = "email", source = "email")
//    @Mapping(target = "cpf", source = "cpf")
//    @Mapping(target = "titulacao", source = "titulacao")
//    @Mapping(target = "area_especializacao", source = "area_especializacao")
//    @Mapping(target = "data_nascimento", source = "data_nascimento")
//    ProfessorDTO toProfessorDTO(Professor professor);
//
//    @Mapping(target = "id", source = "id")
//    @Mapping(target = "nome", source = "nome")
//    @Mapping(target = "email", source = "email")
//    @Mapping(target = "cpf", source = "cpf")
//    @Mapping(target = "titulacao", source = "titulacao")
//    @Mapping(target = "area_especializacao", source = "area_especializacao")
//    @Mapping(target = "data_nascimento", source = "data_nascimento")
//    Professor toProfessorEntity(ProfessorDTO dto);
//
//    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
//    void updateProfessorFromDTO(ProfessorDTO dto, @MappingTarget Professor entity);

    ProfessorDTO toProfessorDTO(Professor professor);

    Professor toProfessorEntity(ProfessorDTO professorDTO);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateProfessorFromDTO(ProfessorDTO dto, @MappingTarget Professor entity);

    // Método para converter id em Professor (usado pelo ProfessorCursoMapper)
    default Professor fromId(Long id) {
        if (id == null) {
            return null;
        }
        Professor professor = new Professor();
        professor.setId(id);
        return professor;
    }
}
