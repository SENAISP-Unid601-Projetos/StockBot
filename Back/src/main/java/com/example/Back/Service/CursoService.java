package com.example.Back.Service;

import com.example.Back.DTO.CursoDTO;
import com.example.Back.Entity.Aluno;
import com.example.Back.Entity.Curso;
import com.example.Back.Repository.AlunoRepository;
import com.example.Back.Repository.CursoRepository;
import com.example.Back.Repository.ProfessorRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CursoService {

    @Autowired
    private CursoRepository cursoRepository;


    private CursoDTO toDTO(Curso curso) {
        CursoDTO dto = new CursoDTO();
        dto.setIdCurso(curso.getIdCurso());
        dto.setCodigo(curso.getCodigo());
        dto.setNome(curso.getNome());
        dto.setCargaHoraria(curso.getCargaHoraria());
        dto.setDataInicio(curso.getDataInicio());
        dto.setDataTermino(curso.getDataTermino());
        return dto;
    }

    private Curso toEntity(CursoDTO dto) {
        Curso curso = new Curso();
        curso.setIdCurso(dto.getIdCurso());
        curso.setCodigo(dto.getCodigo());
        curso.setNome(dto.getNome());
        curso.setCargaHoraria( dto.getCargaHoraria());
        curso.setDataInicio(dto.getDataInicio());
        curso.setDataTermino(dto.getDataTermino());
        return curso;
    }

//    @Transactional
//    public ResponseEntity<CursoDTO> criarCurso (CursoDTO cursoDTO) {
//        Optional<Aluno> alunoOpt
//
//    }

}
