package com.example.Back.DTO;

import com.example.Back.Entity.MatriculaStatus;
import org.jetbrains.annotations.NotNull;


import java.time.LocalDate;

public record MatriculaDTO(

        @NotNull
        Integer alunoId,

        @NotNull
        Integer cursoId,

        @NotNull
        LocalDate dataMatricula,

        @NotNull
        MatriculaStatus status

) {}
