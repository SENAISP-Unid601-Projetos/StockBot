package com.example.Back.Repository;

import com.example.Back.Entity.Historico;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoricoRepository extends JpaRepository<Historico, Long> {

    // OTIMIZAÇÃO DE PERFORMANCE (CRÍTICA):
    // O 'attributePaths = {"componente"}' faz um JOIN FETCH automático.
    // Assim, quando você pedir historico.getComponente().getNome(), o dado já está na memória.
    @EntityGraph(attributePaths = {"componente"})
    Page<Historico> findAllByEmpresaId(Long empresaId, Pageable pageable);

    // Usado para deletar componentes (limpeza em cascata manual se necessário)
    void deleteAllByComponenteIdAndEmpresaId(Long componenteId, Long empresaId);

    // Busca para gráficos ou auditoria de um item específico
    List<Historico> findByComponenteIdAndEmpresaId(Long componenteId, Long empresaId);
}