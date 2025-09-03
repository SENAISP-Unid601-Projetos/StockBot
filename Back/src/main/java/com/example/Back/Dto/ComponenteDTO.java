package com.example.Back.Dto;

import com.example.Back.Entity.Componente;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor // O Lombok vai criar um construtor com todos os campos
public class ComponenteDTO {

    // 1. ADICIONAMOS O CAMPO ID
    private Long id;

    private String nome;
    private String codigoPatrimonio;
    private int quantidade;
    private String localizacao;
    private String categoria;
    private String observacoes;

    // 2. ADICIONAMOS UM CONSTRUTOR EXTRA para facilitar a conversão
    //    Este construtor recebe uma Entidade Componente e preenche o DTO.
    public ComponenteDTO(Componente componente) {
        this.id = componente.getId();
        this.nome = componente.getNome();
        this.codigoPatrimonio = componente.getCodigoPatrimonio();
        this.quantidade = componente.getQuantidade();
        this.localizacao = componente.getLocalizacao();
        this.categoria = componente.getCategoria();
        this.observacoes = componente.getObservacoes();
    }
}
