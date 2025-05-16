package com.example.Back.Entity;
import jakarta.persistence.*;
import lombok.*;
import org.jetbrains.annotations.NotNull;


import java.time.LocalDate;

@Entity
@Table(name = "matriculas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@IdClass(MatriculaId.class)
public class Matricula {

    @Id
    @Column(name = "aluno_id")
    private Integer alunoId;

    @Id
    @Column(name = "curso_id")
    private Integer cursoId;

    @NotNull
    @Column(name = "data_matricula", nullable = false)
    private LocalDate dataMatricula;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatriculaStatus status;
}
