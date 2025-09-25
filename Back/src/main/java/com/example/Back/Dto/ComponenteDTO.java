package com.example.Back.Dto;

import com.example.Back.Entity.Componente;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor // O Lombok vai criar o construtor com TODOS os campos, incluindo o novo
public class ComponenteDTO {

    private Long id;
    private String nome;
    private String codigoPatrimonio;
    private int quantidade;
    private String localizacao;
    private String categoria;
    private String observacoes;

    // 1. ADICIONA O CAMPO QUE FALTAVA
    private int nivelMinimoEstoque;

    // 2. ATUALIZA O CONSTRUTOR AUXILIAR
//    Este construtor converte uma Entidade para este DTO
    public ComponenteDTO(Componente componente) {
        this.id = componente.getId();
        this.nome = componente.getNome();
        this.codigoPatrimonio = componente.getCodigoPatrimonio();
        this.quantidade = componente.getQuantidade();
        this.localizacao = componente.getLocalizacao();
        this.categoria = componente.getCategoria();
        this.observacoes = componente.getObservacoes();
// Adiciona a linha que faltava para o novo campo
        this.nivelMinimoEstoque = componente.getNivelMinimoEstoque();
    }
}

