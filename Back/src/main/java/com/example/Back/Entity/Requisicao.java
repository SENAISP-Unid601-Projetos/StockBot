package com.example.Back.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "requisicoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Requisicao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // OTIMIZAÇÃO: FetchType.LAZY (Não traga o componente a menos que eu peça)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "componente_id", nullable = false)
    private Componente componente;

    @Column(nullable = false)
    private LocalDateTime dataRequisicao;

    @Column(nullable = false)
    private String status; // "PENDENTE", "CONCLUIDO", "RECUSADO"

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @Column(nullable = true)
    private Integer quantidade;

    @Column(length = 500) // Limita tamanho do texto
    private String justificativa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitante_id", nullable = true)
    private Usuario solicitante;
}