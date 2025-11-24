package com.example.Back.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardDataDTO {
    // KPIs (Cartões do topo)
    private long totalItens;
    private long itensEmFalta;
    private long totalQuantidadeEstoque;
    private long requisicoesPendentes;
    private long pedidosCompraPendentes;

    // Dados para Gráficos
    private List<DashboardStatsDTO> distribuicaoPorCategoria; // Esse DTO você já tem

    // Lista de Alerta
    private List<ComponenteDTO> itensEstoqueBaixo;


}