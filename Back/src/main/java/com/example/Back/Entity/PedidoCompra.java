package com.example.Back.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "pedidos_compra")
@Data
public class PedidoCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomeItem; // O item que não existe no estoque

    @Column(nullable = false)
    private int quantidade;

    @Column(columnDefinition = "TEXT")
    private String justificativa;

    @Column(nullable = false)
    private String status; // Ex: PENDENTE, APROVADO, RECUSADO

    @Column(nullable = false)
    private LocalDateTime dataPedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitante_id", nullable = false)
    private Usuario solicitante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;
}