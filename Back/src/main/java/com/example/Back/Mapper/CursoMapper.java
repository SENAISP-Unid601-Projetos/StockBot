package com.example.Back.Mapper;


import com.example.Back.DTO.CursoDTO;
import com.example.Back.Entity.Curso;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CursoMapper {
    CursoMapper INSTANCE = Mappers.getMapper(CursoMapper.class);

    CursoDTO toCursoDTO (Curso curso);
    Curso fromCursoEntity(CursoDTO cursoDTO);
}