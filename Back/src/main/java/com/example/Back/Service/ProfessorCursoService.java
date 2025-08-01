package com.example.Back.Service;

import com.example.Back.DTO.ProfessorCursoCreatedDTO;
import com.example.Back.DTO.ProfessorCursoResponseDTO;
import com.example.Back.Entity.Curso;
import com.example.Back.Entity.Professor;
import com.example.Back.Entity.ProfessorCurso;
import com.example.Back.Repository.CursoRepository;
import com.example.Back.Repository.ProfessorCursoRepository;
import com.example.Back.Repository.ProfessorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorCursoService {

    private final ProfessorCursoRepository professorCursoRepository;
    private final ProfessorRepository professorRepository;
    private final CursoRepository cursoRepository;

    @Autowired
    public ProfessorCursoService(ProfessorCursoRepository professorCursoRepository,
                                 ProfessorRepository professorRepository,
                                 CursoRepository cursoRepository) {
        this.professorCursoRepository = professorCursoRepository;
        this.professorRepository = professorRepository;
        this.cursoRepository = cursoRepository;
    }

    @Transactional
    public ProfessorCursoResponseDTO cadastrar(ProfessorCursoCreatedDTO dto) {
        Professor professor = professorRepository.findById(dto.getProfessorId())
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado"));
        Curso curso = cursoRepository.findById(dto.getCursoId())
                .orElseThrow(() -> new EntityNotFoundException("Curso não encontrado"));

        ProfessorCurso pc = new ProfessorCurso();
        pc.setProfessor(professor);
        pc.setCurso(curso);
        pc.setDisciplina(dto.getDisciplina());
        pc.setPeriodo(dto.getPeriodo());

        ProfessorCurso salvo = professorCursoRepository.save(pc);

        return new ProfessorCursoResponseDTO(
                salvo.getId(),
                professor.getNome(),
                curso.getNome(),
                salvo.getDisciplina(),
                salvo.getPeriodo()
        );
    }

    public List<ProfessorCursoResponseDTO> listarTodos() {
        return professorCursoRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ProfessorCursoResponseDTO> listarPorProfessor(Long professorId) {
        return professorCursoRepository.findByProfessorId(professorId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ProfessorCursoResponseDTO> listarPorCurso(Long cursoId) {
        // --- AQUI É ONDE VOCÊ PRECISA FAZER A MUDANÇA ---
        return professorCursoRepository.findByCurso_IdCurso(cursoId).stream() // <<--- MUDAR PARA findByCurso_IdCurso
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removerAssociacao(Long id) {
        professorCursoRepository.deleteById(id);
    }

    @Transactional
    public ProfessorCursoResponseDTO atualizarAssociacao(Long id, ProfessorCursoCreatedDTO dto) {
        ProfessorCurso associacao = professorCursoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Associação não encontrada"));

        Professor professor = professorRepository.findById(dto.getProfessorId())
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado"));
        Curso curso = cursoRepository.findById(dto.getCursoId())
                .orElseThrow(() -> new EntityNotFoundException("Curso não encontrado"));

        associacao.setProfessor(professor);
        associacao.setCurso(curso);
        associacao.setDisciplina(dto.getDisciplina());
        associacao.setPeriodo(dto.getPeriodo());

        ProfessorCurso atualizado = professorCursoRepository.save(associacao);

        return toResponseDTO(atualizado);
    }

    private ProfessorCursoResponseDTO toResponseDTO(ProfessorCurso pc) {
        return new ProfessorCursoResponseDTO(
                pc.getId(),
                pc.getProfessor().getNome(),
                pc.getCurso().getNome(),
                pc.getDisciplina(),
                pc.getPeriodo()
        );
    }
}