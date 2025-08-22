package com.example.Back.Repository;

import com.example.Back.Entity.Historico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoricoRepository extends JpaRepository<Historico, Long> {
    /**
     * Busca o histórico de movimentações por ID do componente associado.
     * @param componenteId O ID do componente.
     * @return Uma lista de objetos Historico.
     */
    List<Historico> findByComponenteId(Long componenteId);
}