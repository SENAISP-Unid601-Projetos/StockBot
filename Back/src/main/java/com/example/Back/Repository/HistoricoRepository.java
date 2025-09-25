package com.example.Back.Repository;

import com.example.Back.Entity.Historico;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable; // ← IMPORTAÇÃO CORRETA!
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoricoRepository extends JpaRepository<Historico, Long> {

    Page<Historico> findAll(Pageable pageable); // ← Tipo genérico adicionado
    List<Historico> findByComponenteId(Long componenteId);
}