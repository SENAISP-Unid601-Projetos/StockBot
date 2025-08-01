package com.example.Back.DTO;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegistroMovimentacaoDTO {
    public enum TipoMovimentacao {
        ENTRADA, SAIDA, TRANSFERENCIA, AJUSTE
    }

    @NotNull(message = "Tipo de movimentação é obrigatório")
    private TipoMovimentacao tipo;

    @NotBlank(message = "Código do material é obrigatório")
    private String materialCodigo;

    @Positive(message = "Quantidade deve ser maior que zero")
    @NotNull(message = "Quantidade é obrigatória")
    private Integer quantidade;

    @Size(max = 500, message = "Observações deve ter no máximo 500 caracteres")
    private String observacoes;

    private String origem;
    private String destino;
}