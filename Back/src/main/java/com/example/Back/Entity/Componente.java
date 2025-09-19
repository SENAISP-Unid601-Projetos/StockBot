package com.example.Back.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List; // Importa a classe List

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "componentes")
public class Componente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String codigoPatrimonio;

    private int quantidade;
    private String localizacao;
    private String categoria;
    private String observacoes;
    private int nivelMinimoEstoque;

    @OneToMany(mappedBy = "componente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Historico> historicos;
}
