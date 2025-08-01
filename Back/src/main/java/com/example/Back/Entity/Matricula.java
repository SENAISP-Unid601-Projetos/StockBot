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

    // --- NOVO CAMPO PARA O RELACIONAMENTO BIDIRECIONAL COM ALUNO ---
    // Este é o lado "proprietário" do relacionamento @OneToOne.
    // Ele mapeia a chave primária 'aluno_id' para a entidade Aluno.
    @MapsId("alunoId") // Indica que 'alunoId' é mapeado do ID da entidade Aluno.
    @OneToOne
    @JoinColumn(name = "aluno_id", referencedColumnName = "id") // Garante que a coluna de junção é 'aluno_id'
    private Aluno aluno; // <--- AGORA A ENTIDADE MATRICULA TEM UM CAMPO 'aluno'

    @NotNull
    @Column(name = "data_matricula", nullable = false)
    private LocalDate dataMatricula;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatriculaStatus status;
}