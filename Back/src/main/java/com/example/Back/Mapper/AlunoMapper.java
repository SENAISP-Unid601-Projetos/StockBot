package com.example.Back.Mapper;

import com.example.Back.DTO.AlunoDTO;
import com.example.Back.Entity.Aluno;
import com.example.Back.Entity.Matricula;
import com.example.Back.Entity.MatriculaId;
import com.example.Back.Entity.MatriculaStatus;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.time.LocalDate;

@Mapper(componentModel = "spring")
public interface AlunoMapper {

    AlunoMapper INSTANCE = Mappers.getMapper(AlunoMapper.class);

    AlunoDTO toAlunoDTO(Aluno aluno);

    Aluno fromAlunoEntity(AlunoDTO alunoDTO);

    default Aluno fromId(Long id) {
        if (id == null) {
            return null;
        }
        Aluno aluno = new Aluno();
        aluno.setId(id);
        return aluno;
    }

    // --- CONVERSÃO Matricula → String ---
    default String map(Matricula matricula) {
        if (matricula == null) {
            return null;
        }
        return matricula.getAlunoId() + "-" + matricula.getCursoId();
    }

    // --- CONVERSÃO String → Matricula ---
    default Matricula map(String matriculaString) {
        if (matriculaString == null || matriculaString.isEmpty()) {
            return null;
        }

        String[] parts = matriculaString.split("-");
        if (parts.length != 2) {
            throw new IllegalArgumentException("String de matrícula inválida: " + matriculaString);
        }

        try {
            Long alunoId = Long.parseLong(parts[0]);
            Long cursoId = Long.parseLong(parts[1]);

            Matricula matricula = new Matricula();
            matricula.setAlunoId(alunoId);
            matricula.setCursoId(cursoId);

            // Preenchimento padrão
            if (matricula.getDataMatricula() == null) {
                matricula.setDataMatricula(LocalDate.now());
            }
            if (matricula.getStatus() == null) {
                matricula.setStatus(MatriculaStatus.ATIVO);
            }

            return matricula;
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("IDs de matrícula inválidos: " + matriculaString, e);
        }
    }
}