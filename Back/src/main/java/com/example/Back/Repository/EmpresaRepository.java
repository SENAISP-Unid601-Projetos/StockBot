package com.example.Back.Repository;

import com.example.Back.Entity.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

    // 1. BUSCA SEGURA PARA LOGIN
    // "Google", "GOOGLE", "google" -> Tudo retorna a mesma empresa.
    Optional<Empresa> findByDominioIgnoreCase(String dominio);

    // 2. VALIDAÇÃO RÁPIDA PARA REGISTRO
    // Usado no RegisterDTO para checar se já existe antes de tentar salvar.
    boolean existsByDominioIgnoreCase(String dominio);
}