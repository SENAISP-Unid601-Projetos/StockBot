package com.example.Back.Controller;

import com.example.Back.DTO.ProfessorDTO;
import com.example.Back.Service.ProfessorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    private final ProfessorService professorService;

    @Autowired
    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }

    @PostMapping
    public ResponseEntity<ProfessorDTO> criarProfessor(@Valid @RequestBody ProfessorDTO professorDTO) {
        ProfessorDTO novoProfessor = professorService.criarProfessor(professorDTO);
        return new ResponseEntity<>(novoProfessor, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProfessorDTO>> listarTodosProfessores() {
        List<ProfessorDTO> professores = professorService.listarTodos();
        return new ResponseEntity<>(professores, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfessorDTO> buscarProfessorPorId(@PathVariable Long id) {
        ProfessorDTO professor = professorService.buscarPorId(id);
        return new ResponseEntity<>(professor, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfessorDTO> atualizarProfessor(
            @PathVariable Long id,
            @Valid @RequestBody ProfessorDTO professorDTO) {
        ProfessorDTO professorAtualizado = professorService.atualizarProfessor(id, professorDTO);
        return new ResponseEntity<>(professorAtualizado, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProfessor(@PathVariable Long id) {
        professorService.deletarProfessor(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<ProfessorDTO> buscarProfessorPorCpf(@PathVariable String cpf) {
        ProfessorDTO professor = professorService.buscarPorCpf(cpf);
        return new ResponseEntity<>(professor, HttpStatus.OK);
    }
}