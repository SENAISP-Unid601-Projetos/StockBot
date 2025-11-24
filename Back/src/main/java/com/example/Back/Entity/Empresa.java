package com.example.Back.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "empresas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Empresa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // O domínio é o ID "humano" da empresa (ex: 'tesla', 'google').
    // updatable = false: Uma vez criado, não muda o domínio para não quebrar links.
    @Column(unique = true, nullable = false, length = 100, updatable = false)
    private String dominio;

    // MELHORIA: Nome de exibição (ex: 'Tesla Motors Inc.')
    // Se o front não mandar, a gente usa o domínio como nome.
    @Column(length = 255)
    private String nomeExibicao;

    @Column(nullable = false)
    private int nivelEstoqueBaixoPadrao = 5;

    // Construtor auxiliar para facilitar a criação no AuthService
    public Empresa(String dominio) {
        this.dominio = dominio.toLowerCase().trim(); // Força minúsculo e sem espaço
        this.nomeExibicao = dominio; // Padrão: nome é igual ao domínio
        this.nivelEstoqueBaixoPadrao = 5;
    }
}