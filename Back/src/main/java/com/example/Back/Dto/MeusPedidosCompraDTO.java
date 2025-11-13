package com.example.Back.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeusPedidosCompraDTO {
    private Long id;
    private String nomeItem;
    private int quantidade;
    private LocalDateTime dataPedido; // O seu frontend já espera este nome
    private String status;
}