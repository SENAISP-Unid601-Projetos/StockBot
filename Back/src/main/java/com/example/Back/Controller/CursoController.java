package com.example.Back.Controller;

import com.example.Back.DTO.CursoDTO;
import com.example.Back.Service.CursoService;
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
    public ResponseEntity<CursoDTO> criarCurso(@RequestBody CursoDTO cursoDTO) {
        CursoDTO novoCurso = cursoService.criarCurso(cursoDTO);
        return new ResponseEntity<>(novoCurso, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CursoDTO>> listarTodosCursos() {
        List<CursoDTO> cursos = cursoService.listarTodosCursos();
        return new ResponseEntity<>(cursos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CursoDTO> buscarCursoPorId(@PathVariable Long id) {
        CursoDTO curso = cursoService.buscarCursoPorId(id);
        return ResponseEntity.ok(curso);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CursoDTO> atualizarCurso(@PathVariable Long id, @RequestBody CursoDTO cursoDTO) {
        CursoDTO cursoAtualizado = cursoService.atualizarCurso(id, cursoDTO);
        return ResponseEntity.ok(cursoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCurso(@PathVariable Long id) {
        cursoService.deletarCurso(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<CursoDTO>> buscarCursosPorNome(@RequestParam String nome) {
        List<CursoDTO> cursos = cursoService.buscarCursosPorNome(nome);
        return ResponseEntity.ok(cursos);
    }
}