// src/main/java/com/example/Back/Entity/Alerta.java
package com.example.Back.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "alertas")
public class Alerta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String mensagem;

    @Size(max = 500)
    @Column(length = 500)
    private String comentarioResolucao;

    @ManyToOne
    @JoinColumn(name = "usuario_resolucao_id")
    private Usuario usuarioResolucao;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AlertaStatus status = AlertaStatus.PENDENTE;

    @Column(nullable = false)
    private LocalDateTime dataCriacao = LocalDateTime.now();

    @Column
    private LocalDateTime dataResolucao;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuarioResponsavel;

    public enum AlertaStatus {
        PENDENTE,
        RESOLVIDO,
        ARQUIVADO
    }
}