package com.example.Back.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "historico")
public class Historico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ID padronizado para ser gerado pelo banco

    @Column(nullable = false, unique = true)
    private String codigoMovimentacao; // Campo para o seu ID "MOV-1024"

    @Column(nullable = false)
    private LocalDateTime dataHora;

    @Enumerated(EnumType.STRING) // Armazena "ENTRADA" ou "SAIDA" no banco
    @Column(nullable = false)
    private TipoMovimentacao tipo;

    @ManyToOne // Define o relacionamento: Muitos históricos para UM componente
    @JoinColumn(name = "componente_id", nullable = false) // Chave estrangeira no banco
    private Componente componente;

    @Column(nullable = false)
    private int quantidade;

    // Sugestão: No futuro, este campo pode se tornar um relacionamento
    // @ManyToOne com uma entidade Usuario.
    private String usuario;
}