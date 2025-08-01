package com.example.Back.Entity;

import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatriculaId implements Serializable {

    private Long alunoId;
    private Integer cursoId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MatriculaId that)) return false;
        return Objects.equals(alunoId, that.alunoId) &&
                Objects.equals(cursoId, that.cursoId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(alunoId, cursoId);
    }
}
