package com.example.Back.Dto;

import com.example.Back.Entity.PedidoCompra;
import lombok.Data;
import java.util.Date;

@Data
public class PedidoCompraDTO {
    private Long id;
    private String nomeItem;
    private Integer quantidade;
    private String justificativa;
    private String status;
    private Date dataPedido;
    private String usuarioNome; // O Admin precisa saber quem pediu

    public PedidoCompraDTO(PedidoCompra pedido) {
        this.id = pedido.getId();
        this.nomeItem = pedido.getNomeItem();
        this.quantidade = pedido.getQuantidade();
        this.justificativa = pedido.getJustificativa();
        this.status = pedido.getStatus();
        this.dataPedido = pedido.getDataPedido();
        if (pedido.getUsuario() != null) {
            this.usuarioNome = pedido.getUsuario().getNome();
        }
    }
}