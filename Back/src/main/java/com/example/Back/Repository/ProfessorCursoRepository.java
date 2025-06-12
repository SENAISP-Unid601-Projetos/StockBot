package com.example.Back.Repository;

import com.example.Back.Entity.ProfessorCurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfessorCursoRepository extends JpaRepository<ProfessorCurso, Long> {
    List<ProfessorCurso> findByProfessorId(Long professorId);

    // --- CORREÇÃO AQUI ---
    List<ProfessorCurso> findByCurso_IdCurso(Long cursoId); // <--- Correto: findByCurso_IdCurso
}