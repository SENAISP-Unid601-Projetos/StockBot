package com.example.Back.Repository;

import com.example.Back.Entity.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    List<Aluno> findByNomeContainingIgnoreCase(String nome);
    Optional<Aluno> findByEmail(String email);


}

