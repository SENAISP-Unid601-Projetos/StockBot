package com.example.Back.Service;

import com.example.Back.DTO.MatriculaDTO;
import com.example.Back.Entity.Matricula;
import com.example.Back.Entity.MatriculaId;
import com.example.Back.Entity.Aluno;
import com.example.Back.Repository.MatriculaRepository;
import com.example.Back.Repository.AlunoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatriculaService {

    private final MatriculaRepository repository;
    private final AlunoRepository alunoRepository;

    // --- ADICIONE ESTE MÉTODO DE VOLTA ---
    public List<MatriculaDTO> listarTodas() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // --- Adicione/Mantenha seus outros métodos aqui ---
    public MatriculaDTO buscarPorId(Integer alunoId, Integer cursoId) {
        MatriculaId id = new MatriculaId(alunoId, cursoId);
        return repository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new EntityNotFoundException("Matrícula não encontrada"));
    }

    public MatriculaDTO criar(MatriculaDTO dto) {
        Matricula m = toEntity(dto); // toEntity usa o novo construtor com Aluno
        return toDTO(repository.save(m));
    }

    public MatriculaDTO atualizar(MatriculaDTO dto) {
        MatriculaId id = new MatriculaId(dto.alunoId(), dto.cursoId());
        Matricula existente = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Matrícula não encontrada"));

        existente.setDataMatricula(dto.dataMatricula());
        existente.setStatus(dto.status());

        // Se você precisar atualizar o Aluno referenciado na Matrícula, precisaria de mais lógica aqui.
        // Por exemplo, se Aluno fosse atualizável via DTO da Matricula.

        return toDTO(repository.save(existente));
    }

    public void deletar(Integer alunoId, Integer cursoId) {
        repository.deleteById(new MatriculaId(alunoId, cursoId));
    }

    private MatriculaDTO toDTO(Matricula m) {
        // Assegure-se de que MatriculaDTO tem os campos corretos e é um record ou tem construtor.
        // Se AlunoDTO tem String 'matricula' (que é combinada de AlunoId-CursoId),
        // este DTO é para listar, então os IDs separados estão OK.
        return new MatriculaDTO(
                m.getAlunoId(),
                m.getCursoId(),
                m.getDataMatricula(),
                m.getStatus()
        );
    }

    private Matricula toEntity(MatriculaDTO dto) {
        // Busque a entidade Aluno correspondente ao alunoId do DTO.
        Aluno aluno = alunoRepository.findById(Long.valueOf(dto.alunoId()))
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado para a matrícula: " + dto.alunoId()));

        return new Matricula(
                dto.alunoId(),
                dto.cursoId(),
                aluno, // Passe o objeto Aluno aqui
                dto.dataMatricula(),
                dto.status()
        );
    }
}