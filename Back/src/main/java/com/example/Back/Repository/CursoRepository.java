package com.example.Back.Repository;

import com.example.Back.Entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CursoRepository extends JpaRepository<Curso, Long> {
    Optional <Curso> findByIdCurso(Long idCurso);
    Optional <Curso> findByCodigo(String codigo);
}
