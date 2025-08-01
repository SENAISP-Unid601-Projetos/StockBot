package com.example.Back.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Curso")
public class Curso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCurso;

    @NotBlank(message = "Código é obrigatório")
    @Column(unique = true, nullable = false, length = 10)
    private String codigo;

    @NotBlank(message = "Nome é obrigatório")
    @Column(nullable = false, length = 100)
    private String nome;

    @NotNull(message = "Carga horária é obrigatória")
    @Column(nullable = false)
    private float cargaHoraria;

    @NotNull(message = "Data de início é obrigatória")
    @Column(nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_termino")
    private LocalDate dataTermino;
}