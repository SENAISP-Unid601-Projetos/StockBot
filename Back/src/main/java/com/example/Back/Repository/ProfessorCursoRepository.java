package com.example.Back.Repository;

import com.example.Back.Entity.ProfessorCurso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfessorCursoRepository extends JpaRepository<ProfessorCurso, Long> {
    List<ProfessorCurso> findByProfessorId(Long professorId);
    List<ProfessorCurso> findByCursoId(Long cursoId);
}