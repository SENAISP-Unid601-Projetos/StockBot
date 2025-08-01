// src/main/java/com/example/Back/Entity/Material.java
package com.example.Back.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Entity
@Data
@Table(name = "materiais")
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Código é obrigatório")
    @Column(unique = true, nullable = false)
    private String codigo;

    @NotBlank(message = "Nome é obrigatório")
    @Column(nullable = false)
    private String nome;

    private String descricao;

    @Min(value = 0, message = "Quantidade não pode ser negativa")
    @Column(nullable = false)
    private Integer quantidade = 0;

    @Min(value = 0, message = "Estoque mínimo não pode ser negativo")
    @Column(nullable = false)
    private Integer estoqueMinimo = 5;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Categoria categoria;

    @Column(nullable = false)
    private String localizacao = "Estoque Principal";

    public Material orElseThrow(Object o) {


    }

    public enum Categoria {
        FERRAMENTA, EQUIPAMENTO, CONSUMIVEL, OUTROS
    }
}