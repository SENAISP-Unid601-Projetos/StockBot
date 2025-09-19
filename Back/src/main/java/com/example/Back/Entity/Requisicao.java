package com.example.Back.Entity;

import jakarta.persistence.
        *;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data // Esta anotação já cria TODOS os getters e setters para nós\!
public class Requisicao {

// --- CAMPOS (Os "dados" que a entidade guarda) ---

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "componente_id", nullable = false)
    private Componente componente;

    private LocalDateTime dataRequisicao;

    private String status;
    }