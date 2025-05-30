package com.example.Back.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Table(name = "professor")
public class Professor extends Usuario {

    @NotBlank
    @Column(unique = true, length = 11)
    private String cpf;

    private String titulacao;
    private String area_especializacao;
    private Date data_nascimento;

    public String getNome() {
        return super.getNome();
    }
}