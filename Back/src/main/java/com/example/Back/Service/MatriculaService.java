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

    public List<MatriculaDTO> listarTodas() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public MatriculaDTO buscarPorId(Long alunoId, Long cursoId) {
        MatriculaId id = new MatriculaId(alunoId, cursoId);
        return repository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new EntityNotFoundException("Matrícula não encontrada"));
    }

    public MatriculaDTO criar(MatriculaDTO dto) {
        Matricula m = toEntity(dto);
        return toDTO(repository.save(m));
    }

    public MatriculaDTO atualizar(MatriculaDTO dto) {
        MatriculaId id = new MatriculaId(dto.alunoId(), dto.cursoId());
        Matricula existente = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Matrícula não encontrada"));

        existente.setDataMatricula(dto.dataMatricula());
        existente.setStatus(dto.status());

        return toDTO(repository.save(existente));
    }

    public void deletar(Long alunoId, Long cursoId) {
        repository.deleteById(new MatriculaId(alunoId, cursoId));
    }

    private MatriculaDTO toDTO(Matricula m) {
        return new MatriculaDTO(
                m.getAlunoId(),
                m.getCursoId(),
                m.getDataMatricula(),
                m.getStatus()
        );
    }

    private Matricula toEntity(MatriculaDTO dto) {
        Aluno aluno = alunoRepository.findById(dto.alunoId())
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado para a matrícula: " + dto.alunoId()));

        return new Matricula(
                dto.alunoId(),
                dto.cursoId(),
                aluno,
                dto.dataMatricula(),
                dto.status()
        );
    }
}
