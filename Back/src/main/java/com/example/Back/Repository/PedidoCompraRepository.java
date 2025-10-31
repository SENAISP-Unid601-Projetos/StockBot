package com.example.Back.Repository;

import com.example.Back.Entity.PedidoCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface PedidoCompraRepository extends JpaRepository<PedidoCompra, Long> {

    // Para o Admin ver os pendentes
    Page<PedidoCompra> findByStatus(String status, Pageable pageable);

    // Para o Usuário ver os seus próprios pedidos
    List<PedidoCompra> findByUsuarioId(Long usuarioId);
}