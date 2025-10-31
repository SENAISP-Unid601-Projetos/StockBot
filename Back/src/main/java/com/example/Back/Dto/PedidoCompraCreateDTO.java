package com.example.Back.Dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PedidoCompraCreateDTO {

    @NotBlank(message = "O nome do item é obrigatório")
    private String nomeItem;

    @Min(value = 1, message = "A quantidade deve ser pelo menos 1")
    private Integer quantidade;

    private String justificativa;
}