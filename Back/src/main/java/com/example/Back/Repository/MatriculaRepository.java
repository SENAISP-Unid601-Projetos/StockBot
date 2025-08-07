package com.example.Back.Repository;

import com.example.Back.Entity.Matricula;
import com.example.Back.Entity.MatriculaId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatriculaRepository extends JpaRepository<Matricula, MatriculaId> {
    List<Matricula> findByAlunoId(Long alunoId);
    List<Matricula> findByCursoId(Long cursoId);
}