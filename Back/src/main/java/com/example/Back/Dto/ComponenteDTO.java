package com.example.Back.Dto;

import com.example.Back.Entity.Componente;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ComponenteDTO {
    private Long id;
    private String nome;
    private String codigoPatrimonio;
    private int quantidade;
    private String localizacao;
    private String categoria;
    private String observacoes;


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
