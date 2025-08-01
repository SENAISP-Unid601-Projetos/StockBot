package com.example.Back.Service;

import com.example.Back.DTO.MatriculaDTO;
import com.example.Back.Entity.Aluno;
import com.example.Back.Entity.Matricula;
import com.example.Back.Entity.MatriculaId;
import com.example.Back.Repository.AlunoRepository;
import com.example.Back.Repository.MatriculaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Injeta os repositórios via construtor, uma ótima prática.
public class MatriculaService {

    private final MatriculaRepository matriculaRepository;
    private final AlunoRepository alunoRepository;

    @Transactional(readOnly = true)
    public List<MatriculaDTO> listarTodas() {
        return matriculaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MatriculaDTO buscarPorId(Long alunoId, Integer cursoId) { // <-- CORRIGIDO para Long
        MatriculaId id = new MatriculaId(alunoId, cursoId);
        return matriculaRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new EntityNotFoundException("Matrícula não encontrada para o ID: " + id));
    }

    @Transactional
    public MatriculaDTO criar(MatriculaDTO dto) {
        // Validação para evitar matricular o mesmo aluno no mesmo curso duas vezes.
        MatriculaId id = new MatriculaId(dto.alunoId(), dto.cursoId());
        if (matriculaRepository.existsById(id)) {
            throw new IllegalArgumentException("Esta matrícula já existe.");
        }

        Matricula novaMatricula = toEntity(dto);
        Matricula matriculaSalva = matriculaRepository.save(novaMatricula);
        return toDTO(matriculaSalva);
    }

    @Transactional
    public MatriculaDTO atualizar(Long alunoId, Integer cursoId, MatriculaDTO dto) { // <-- Assinatura mais clara
        MatriculaId id = new MatriculaId(alunoId, cursoId);
        Matricula matriculaExistente = matriculaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Matrícula não encontrada para o ID: " + id));

        // Atualiza apenas os campos permitidos
        matriculaExistente.setDataMatricula(dto.dataMatricula());
        matriculaExistente.setStatus(dto.status());

        Matricula matriculaAtualizada = matriculaRepository.save(matriculaExistente);
        return toDTO(matriculaAtualizada);
    }

    @Transactional
    public void deletar(Long alunoId, Integer cursoId) { // <-- CORRIGIDO para Long
        MatriculaId id = new MatriculaId(alunoId, cursoId);
        if (!matriculaRepository.existsById(id)) {
            throw new EntityNotFoundException("Matrícula não encontrada para o ID: " + id);
        }
        matriculaRepository.deleteById(id);
    }

    // --- MÉTODOS DE CONVERSÃO PRIVADOS ---

    private MatriculaDTO toDTO(Matricula matricula) {
        return new MatriculaDTO(
                matricula.getAlunoId(),
                matricula.getCursoId(),
                matricula.getDataMatricula(),
                matricula.getStatus()
        );
    }

    private Matricula toEntity(MatriculaDTO dto) {
        // Busca a entidade Aluno para garantir que ela exista antes de criar a relação.
        Aluno aluno = alunoRepository.findById(dto.alunoId()) // <-- Simplificado, sem Long.valueOf()
                .orElseThrow(() -> new EntityNotFoundException("Aluno com ID " + dto.alunoId() + " não encontrado."));

        // Assume que a entidade Curso também seria validada aqui em um cenário real.
        // new Curso(dto.cursoId()) ...

        Matricula matricula = new Matricula();
        matricula.setAlunoId(dto.alunoId());
        matricula.setCursoId(dto.cursoId());
        matricula.setAluno(aluno); // Associa a entidade Aluno encontrada
        matricula.setDataMatricula(dto.dataMatricula());
        matricula.setStatus(dto.status());

        return matricula;
    }
}