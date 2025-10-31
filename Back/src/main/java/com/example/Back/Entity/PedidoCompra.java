
package com.example.Back.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Table(name = "pedidos_compra")
@Data
public class PedidoCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_item", nullable = false)
    private String nomeItem;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(length = 1000)
    private String justificativa;

    @Column(nullable = false)
    private String status;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "data_pedido", nullable = false)
    private Date dataPedido;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
}