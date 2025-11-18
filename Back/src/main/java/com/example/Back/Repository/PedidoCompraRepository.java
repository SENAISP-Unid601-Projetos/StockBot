package com.example.Back.Repository;

import com.example.Back.Entity.PedidoCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import java.util.List;

@Repository
public interface PedidoCompraRepository extends JpaRepository<PedidoCompra, Long> {

    // Para a página "Meus Pedidos"
    List<PedidoCompra> findAllBySolicitanteId(Long solicitanteId);

    // Para a "Central de Aprovações" (que vamos usar depois)
    List<PedidoCompra> findAllByEmpresaIdAndStatus(Long empresaId, String status);

    // Para buscar um pedido específico de uma empresa
    Optional<PedidoCompra> findByIdAndEmpresaId(Long id, Long empresaId);
}