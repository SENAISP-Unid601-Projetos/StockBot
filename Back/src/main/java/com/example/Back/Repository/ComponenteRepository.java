package com.example.Back.Repository;
import com.example.Back.Dto.DashboardStatsDTO;
import com.example.Back.Entity.Componente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComponenteRepository extends JpaRepository<Componente, Long> {

    // =========================================================================
    // 1. LISTAGEM & BUSCA (Paginada e Segura)
    // =========================================================================

    // Listagem padrão paginada (Substitui o findAll simples)
    Page<Componente> findAllByEmpresaId(Long empresaId, Pageable pageable);

    // Busca Avançada: Procura em Nome, Código OU ID (Ignora maiúsculas/minúsculas)
    @Query("SELECT c FROM Componente c WHERE c.empresa.id = :empresaId AND (" +
            "LOWER(c.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "LOWER(c.codigoPatrimonio) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "CAST(c.id AS string) LIKE LOWER(CONCAT('%', :termo, '%')))")
    Page<Componente> searchByTermoAndEmpresaId(@Param("termo") String termo,
                                               @Param("empresaId") Long empresaId,
                                               Pageable pageable);

    // =========================================================================
    // 2. SEGURANÇA E VALIDAÇÃO (Multi-tenant)
    // =========================================================================

    // Busca unitária segura (Impede que user da Coca-Cola veja item da Pepsi via URL)
    Optional<Componente> findByIdAndEmpresaId(Long id, Long empresaId);

    // Validação de unicidade do código de patrimônio DENTRO da empresa
    boolean existsByCodigoPatrimonioAndEmpresaId(String codigoPatrimonio, Long empresaId);

    // Verifica existência rápida antes de deletar (Economiza memória)
    boolean existsByIdAndEmpresaId(Long id, Long empresaId);

    // =========================================================================
    // 3. DASHBOARD & KPIs (Estatísticas)
    // =========================================================================

    // KPI 1: Total de Itens Cadastrados
    long countByEmpresaId(Long empresaId);

    // KPI 2: Soma total de quantidade de peças no estoque
    @Query("SELECT COALESCE(SUM(c.quantidade), 0) FROM Componente c WHERE c.empresa.id = :empresaId")
    long sumQuantidadeByEmpresaId(@Param("empresaId") Long empresaId);

    // KPI 3: Itens com estoque zerado
    @Query("SELECT COUNT(c) FROM Componente c WHERE c.empresa.id = :empresaId AND c.quantidade = 0")
    long countItensEmFaltaByEmpresaId(@Param("empresaId") Long empresaId);

    // LISTA: Itens com Estoque Baixo (Abaixo do mínimo configurado)
    @Query("SELECT c FROM Componente c WHERE c.empresa.id = :empresaId AND c.quantidade <= c.nivelMinimoEstoque")
    List<Componente> findEstoqueBaixoByEmpresaId(@Param("empresaId") Long empresaId);

    // GRÁFICO: Distribuição por Categoria
    // Nota: Precisa do DTO 'DashboardStatsDTO' (String categoria, Long total)
    @Query("SELECT new com.example.Back.Dto.DashboardStatsDTO(c.categoria, SUM(c.quantidade)) " +
            "FROM Componente c WHERE c.empresa.id = :empresaId GROUP BY c.categoria")
    List<DashboardStatsDTO> countByCategoriaGrouped(@Param("empresaId") Long empresaId);
}