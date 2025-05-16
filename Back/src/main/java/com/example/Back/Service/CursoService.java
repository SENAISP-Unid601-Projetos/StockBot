package com.example.Back.Service;

import com.example.Back.DTO.CursoDTO;
import com.example.Back.Entity.Aluno;
import com.example.Back.Entity.Curso;
import com.example.Back.Entity.Professor;
import com.example.Back.Repository.AlunoRepository;
import com.example.Back.Repository.CursoRepository;
import com.example.Back.Repository.ProfessorRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
//        Optional<Aluno> alunoOpt = alunoRepository.findById(cursoDTO.getIdCurso());
//        if (alunoOpt.isEmpty()) {
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//        }
//        Optional<Professor> professorOpt = professorRepository.findById(cursoDTO.getIdCurso());
//        if (professorOpt.isEmpty()) {
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//        }
//
//        Aluno aluno = alunoOpt.get();
//        Professor professor = professorOpt.get();
//
//        Curso curso = toEntity(CursoDTO);
//        Curso novoCurso = cursoRepository.save(curso);
//
//        aluno.getCursos().add(novoCurso);
//        professor.getProfessores().add(novoCurso);
//
//        alunoRepository.save(aluno);
//        professorRepository.save(professor);
//
//        return new ResponseEntity<>(toDTO(novoCurso), HttpStatus.CREATED);
//    }

    public ResponseEntity<List<CursoDTO>> listarCursos() {
        List<CursoDTO> cursos = cursoRepository.findAll()
                .stream()
                .map(curso -> toDTO(curso))
                .collect(Collectors.toList());
        return new ResponseEntity<>(cursos, HttpStatus.OK);
    }
    
}
