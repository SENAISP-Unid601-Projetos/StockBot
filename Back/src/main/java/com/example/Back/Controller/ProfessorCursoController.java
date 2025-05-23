package com.example.Back.Controller;

import com.example.Back.DTO.ProfessorCursoCreatedDTO;
import com.example.Back.DTO.ProfessorCursoResponseDTO;
import com.example.Back.Service.ProfessorCursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professor-curso")
public class ProfessorCursoController {

    private final ProfessorCursoService professorCursoService;

    @Autowired
    public ProfessorCursoController(ProfessorCursoService professorCursoService) {
        this.professorCursoService = professorCursoService;
    }

    @PostMapping
    public ResponseEntity<ProfessorCursoResponseDTO> associarProfessorCurso(
            @RequestBody ProfessorCursoCreatedDTO dto) {
        ProfessorCursoResponseDTO response = professorCursoService.cadastrar(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProfessorCursoResponseDTO>> listarTodasAssociacoes() {
        List<ProfessorCursoResponseDTO> associacoes = professorCursoService.listarTodos();
        return new ResponseEntity<>(associacoes, HttpStatus.OK);
    }

    @GetMapping("/professor/{professorId}")
    public ResponseEntity<List<ProfessorCursoResponseDTO>> listarPorProfessor(
            @PathVariable Long professorId) {
        List<ProfessorCursoResponseDTO> associacoes = professorCursoService.listarPorProfessor(professorId);
        return new ResponseEntity<>(associacoes, HttpStatus.OK);
    }

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<ProfessorCursoResponseDTO>> listarPorCurso(
            @PathVariable Long cursoId) {
        List<ProfessorCursoResponseDTO> associacoes = professorCursoService.listarPorCurso(cursoId);
        return new ResponseEntity<>(associacoes, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removerAssociacao(@PathVariable Long id) {
        professorCursoService.removerAssociacao(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfessorCursoResponseDTO> atualizarAssociacao(
            @PathVariable Long id,
            @RequestBody ProfessorCursoCreatedDTO dto) {
        ProfessorCursoResponseDTO response = professorCursoService.atualizarAssociacao(id, dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}