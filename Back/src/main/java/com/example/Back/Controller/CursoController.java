// CursoController.java
package com.example.Back.Controller;

import com.example.Back.DTO.CursoCreateDTO;
import com.example.Back.DTO.CursoResponseDTO;
import com.example.Back.Service.CursoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cursos")
public class CursoController {

    private final CursoService cursoService;

    @Autowired
    public CursoController(CursoService cursoService) {
        this.cursoService = cursoService;
    }

    @PostMapping
    public ResponseEntity<CursoResponseDTO> criarCurso(@Valid @RequestBody CursoCreateDTO cursoCreateDTO) {
        CursoResponseDTO novoCurso = cursoService.criarCurso(cursoCreateDTO);
        return new ResponseEntity<>(novoCurso, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CursoResponseDTO>> listarTodosCursos() {
        List<CursoResponseDTO> cursos = cursoService.listarTodosCursos();
        return new ResponseEntity<>(cursos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CursoResponseDTO> buscarCursoPorId(@PathVariable Long id) {
        CursoResponseDTO curso = cursoService.buscarCursoPorId(id);
        return ResponseEntity.ok(curso);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CursoResponseDTO> atualizarCurso(
            @PathVariable Long id,
            @Valid @RequestBody CursoCreateDTO cursoCreateDTO) {
        CursoResponseDTO cursoAtualizado = cursoService.atualizarCurso(id, cursoCreateDTO);
        return ResponseEntity.ok(cursoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCurso(@PathVariable Long id) {
        cursoService.deletarCurso(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<CursoResponseDTO>> buscarCursosPorNome(@RequestParam String nome) {
        List<CursoResponseDTO> cursos = cursoService.buscarCursosPorNome(nome);
        return ResponseEntity.ok(cursos);
    }
}