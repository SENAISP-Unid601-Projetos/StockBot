package com.example.Back.Mapper;

import com.example.Back.DTO.AlunoDTO;
import com.example.Back.Entity.Aluno;
import com.example.Back.Entity.Matricula;
import com.example.Back.Entity.MatriculaStatus;
import org.mapstruct.Mapper;

import java.time.LocalDate;

/**
 * Mapper responsável por converter entre a entidade Aluno e seu DTO (AlunoDTO).
 * Utiliza o component model do Spring para ser injetado como um bean.
 */
@Mapper(componentModel = "spring")
public interface AlunoMapper {

    // --- MÉTODOS DE MAPEAMENTO PRINCIPAIS ---

    AlunoDTO toDto(Aluno aluno);

    Aluno toEntity(AlunoDTO alunoDTO);


    // --- MÉTODOS AUXILIARES PARA MAPEAMENTOS COMPLEXOS ---

    /**
     * Converte um objeto Matricula em uma representação de String simples (ID_ALUNO-ID_CURSO).
     * Este método é usado automaticamente pelo MapStruct ao converter Aluno -> AlunoDTO.
     *
     * @param matricula A entidade Matricula.
     * @return Uma string formatada ou null se a matrícula for inválida.
     */
    default String matriculaToString(Matricula matricula) {
        // Validação para evitar NullPointerException
        if (matricula == null || matricula.getAlunoId() == null || matricula.getCursoId() == null) {
            return null;
        }
        return String.format("%d-%d", matricula.getAlunoId(), matricula.getCursoId());
    }

    /**
     * Converte uma string no formato "ID_ALUNO-ID_CURSO" de volta para um objeto Matricula.
     * Este método é usado automaticamente pelo MapStruct ao converter AlunoDTO -> Aluno.
     *
     * @param matriculaString A string contendo os IDs.
     * @return Uma entidade Matricula com os IDs e valores padrão.
     */
    default Matricula stringToMatricula(String matriculaString) {
        if (matriculaString == null || matriculaString.isBlank()) {
            return null;
        }

        String[] parts = matriculaString.split("-");
        if (parts.length != 2) {
            throw new IllegalArgumentException("Formato de string de matrícula inválido. Esperado: 'idAluno-idCurso'. Recebido: " + matriculaString);
        }

        try {
            Matricula matricula = new Matricula();

            // CORREÇÃO: Converte o ID do aluno para Long, conforme a definição da entidade.
            matricula.setAlunoId(Long.parseLong(parts[0]));
            matricula.setCursoId(Integer.parseInt(parts[1]));

            // =================================================================================
            // ATENÇÃO: LÓGICA DE NEGÓCIO NO MAPPER
            // Os campos 'dataMatricula' e 'status' são obrigatórios (@NotNull) na entidade Matricula.
            // Como a string não fornece esses dados, estamos definindo valores PADRÃO aqui.
            // Esta é uma decisão de negócio que pode não ser ideal para todos os casos de uso.
            // A responsabilidade de criar uma matrícula completa deveria ser, idealmente, de uma
            // classe de Serviço (@Service), e não do Mapper.
            // =================================================================================
            matricula.setDataMatricula(LocalDate.now());
            matricula.setStatus(MatriculaStatus.ATIVO);

            return matricula;

        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("IDs na string de matrícula não são números válidos: " + matriculaString, e);
        }
    }
}