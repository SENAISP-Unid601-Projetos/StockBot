package com.example.Back.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

// 1. IMPORTAR A ENTIDADE DO UTILIZADOR
import com.example.Back.Entity.Usuario;

@Entity
@Data
public class Requisicao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "componente_id", nullable = false)
    private Componente componente;

    private LocalDateTime dataRequisicao;

    private String status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    // --- 2. CAMPOS ADICIONADOS ---
    @Column(nullable = true) // Pode ser nulo se a quantidade não for aplicável
    private Integer quantidade;

    @Column(nullable = true)
    private String justificativa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitante_id", nullable = true) // O solicitante pode ser o "Sistema" (nulo) ou um utilizador
    private Usuario solicitante;
}