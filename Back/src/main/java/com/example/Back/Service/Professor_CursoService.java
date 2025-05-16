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

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorCursoService {

    @Autowired
    private ProfessorCursoRepository professorCursoRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private CursoRepository cursoRepository;

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
                .map(pc -> new ProfessorCursoResponseDTO(
                        pc.getId(),
                        pc.getProfessor().getNome(),
                        pc.getCurso().getNome(),
                        pc.getDisciplina(),
                        pc.getPeriodo()
                )).collect(Collectors.toList());
    }
}
