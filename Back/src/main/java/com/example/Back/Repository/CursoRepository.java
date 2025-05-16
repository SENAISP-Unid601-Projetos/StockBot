package com.example.Back.Repository;

import com.example.Back.Entity.Aluno;
import com.example.Back.Entity.Curso;
import com.example.Back.Entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CursoRepository extends JpaRepository<Curso, Long> {
    Optional <Curso> findByIdCurso(Long idCurso);
    Optional <Curso> findByCodigo(String codigo);


    Optional<Object> findByProfessor(Professor professor);
    Optional<Object> findByAluno(Aluno aluno);
}
