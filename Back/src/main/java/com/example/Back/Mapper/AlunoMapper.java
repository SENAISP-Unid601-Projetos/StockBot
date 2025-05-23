package com.example.Back.Mapper;

import com.example.Back.DTO.AlunoDTO;
import com.example.Back.Entity.Aluno;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface AlunoMapper {

    AlunoMapper INSTANCE = Mappers.getMapper(AlunoMapper.class);

    AlunoDTO toAlunoDTO(Aluno aluno);

    Aluno fromAlunoEntity(AlunoDTO alunoDTO);
}
