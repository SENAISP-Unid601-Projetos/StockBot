package com.example.Back.Repository;

import com.example.Back.Entity.Historico;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable; // ← IMPORTAÇÃO CORRETA!
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoricoRepository extends JpaRepository<Historico, Long> {

    Page<Historico> findAllByEmpresaId(Long empresaId, Pageable pageable);
    List<Historico> findByComponenteIdAndEmpresaId(Long componenteId, Long empresaId);

    @Transactional
    void deleteAllByComponenteIdAndEmpresaId(Long componenteId, Long empresaId);
}