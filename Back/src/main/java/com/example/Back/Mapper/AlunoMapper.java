package com.example.Back.Mapper;

import com.example.Back.DTO.AlunoDTO;
import com.example.Back.Entity.Aluno;
import com.example.Back.Entity.Matricula;
import com.example.Back.Entity.MatriculaId; // <<--- IMPORTANTE: IMPORTE MatriculaId
import com.example.Back.Entity.MatriculaStatus; // <<--- Importe se estiver usando o ENUM
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.time.LocalDate; // <<--- Importe LocalDate se for usar dataMatricula
import java.util.Date; // <<--- Importe Date se for usar Date

@Mapper(componentModel = "spring")
public interface AlunoMapper {

    AlunoMapper INSTANCE = Mappers.getMapper(AlunoMapper.class);

    AlunoDTO toAlunoDTO(Aluno aluno);

    // A linha 18 está provavelmente aqui:
    Aluno fromAlunoEntity(AlunoDTO alunoDTO);

    // Método para converter id em Aluno (para uso em outros mappers)
    default Aluno fromId(Long id) {
        if (id == null) {
            return null;
        }
        Aluno aluno = new Aluno();
        aluno.setId(id);
        return aluno;
    }

    // --- MÉTODO PARA MAPEAR ENTIDADE MATRICULA PARA STRING (JÁ FUNCIONANDO) ---
    default String map(Matricula matricula) {
        if (matricula == null) {
            return null;
        }
        return matricula.getAlunoId() + "-" + matricula.getCursoId();
    }

    // --- NOVO MÉTODO: MAPEAR STRING PARA ENTIDADE MATRICULA ---
    // Este método será chamado automaticamente pelo MapStruct
    // quando precisar converter uma 'String' para um objeto 'Matricula'.
    default Matricula map(String matriculaString) {
        if (matriculaString == null || matriculaString.isEmpty()) {
            return null;
        }

        // A lógica aqui deve INVERTER o que você fez no método acima.
        // Se você combinou alunoId-cursoId, desfaça essa combinação.
        String[] parts = matriculaString.split("-");
        if (parts.length != 2) {
            // Lançar uma exceção ou retornar null se a string não estiver no formato esperado
            throw new IllegalArgumentException("String de matrícula inválida: " + matriculaString);
        }

        try {
            Integer alunoId = Integer.parseInt(parts[0]);
            Integer cursoId = Integer.parseInt(parts[1]);

            Matricula matricula = new Matricula();
            matricula.setAlunoId(alunoId);
            matricula.setCursoId(cursoId);

            // IMPORTANTE:
            // Sua entidade Matricula tem campos @NotNull como dataMatricula e status.
            // Ao criar uma Matricula a partir de uma String, você **não tem** esses dados.
            // Você tem algumas opções:
            // 1. Fornecer valores padrão (ex: LocalDate.now(), status default).
            // 2. Trazer esses dados do DTO (se existirem lá).
            // 3. Deixar a criação de Matricula para um serviço, não para o mapper,
            //    ou seja, o mapper só preencheria os IDs e um serviço completaria.

            // Por simplicidade, vamos preencher com valores padrão/básicos para o MapStruct parar de reclamar.
            // VOCÊ DEVE REVISAR ISSO DE ACORDO COM A LÓGICA DO SEU NEGÓCIO.
            if (matricula.getDataMatricula() == null) { // Evita sobrescrever se já tiver algum valor
                matricula.setDataMatricula(LocalDate.now()); // Data atual como padrão
            }
            if (matricula.getStatus() == null) {
                matricula.setStatus(MatriculaStatus.ATIVA); // Exemplo de status padrão, use o seu ENUM
            }


            return matricula;
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("IDs de matrícula inválidos: " + matriculaString, e);
        }
    }
}