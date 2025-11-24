package com.example.Back.Repository;

import com.example.Back.Entity.PedidoCompra;
import org.springframework.data.jpa.repository.EntityGraph; // Importante
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoCompraRepository extends JpaRepository<PedidoCompra, Long> {

    // OTIMIZAÇÃO: Traz solicitante e componente junto
    @EntityGraph(attributePaths = {"solicitante", "componenteExistente"})
    List<PedidoCompra> findAllBySolicitanteIdOrderByDataPedidoDesc(Long solicitanteId);

    // OTIMIZAÇÃO: Traz solicitante (para mostrar quem pediu na tela de aprovação)
    @EntityGraph(attributePaths = {"solicitante", "componenteExistente"})
    List<PedidoCompra> findAllByEmpresaIdAndStatusOrderByDataPedidoDesc(Long empresaId, String status);

    // Busca Segura
    Optional<PedidoCompra> findByIdAndEmpresaId(Long id, Long empresaId);

    long countByEmpresaIdAndStatus(Long empId, String pendente);

}