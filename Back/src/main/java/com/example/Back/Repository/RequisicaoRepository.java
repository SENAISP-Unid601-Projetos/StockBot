package com.example.Back.Repository;

import com.example.Back.Entity.Requisicao;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RequisicaoRepository extends JpaRepository<Requisicao, Long> {

    // OTIMIZAÇÃO CRÍTICA: Traz Componente e Solicitante no mesmo SELECT (JOIN FETCH)
    // Isso reduz de N+1 queries para apenas 1 query.
    @EntityGraph(attributePaths = {"componente", "solicitante"})
    List<Requisicao> findAllByEmpresaIdAndStatusOrderByDataRequisicaoDesc(Long empresaId, String status);

    // Busca Segura (Multi-tenant)
    Optional<Requisicao> findByIdAndEmpresaId(Long id, Long empresaId);

    long countByEmpresaIdAndStatus(Long empId, String pendente);

}