package com.example.Back.Controller;

import com.example.Back.DTO.MatriculaDTO;
import com.example.Back.Service.MatriculaService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matriculas")
@RequiredArgsConstructor
public class MatriculaController {

    private final MatriculaService matriculaService;

    @GetMapping
    public List<MatriculaDTO> listarTodas() {
        return matriculaService.listarTodas();
    }

    @GetMapping("/{alunoId}/{cursoId}")
    public MatriculaDTO buscarPorId(@PathVariable Integer alunoId, @PathVariable Integer cursoId) {
        return matriculaService.buscarPorId(alunoId, cursoId);
    }

    @PostMapping
    public MatriculaDTO criar(@RequestBody @Validated MatriculaDTO dto) {
        return matriculaService.criar(dto);
    }

    @PutMapping
    public MatriculaDTO atualizar(@RequestBody @Validated MatriculaDTO dto) {
        return matriculaService.atualizar(dto);
    }

    @DeleteMapping("/{alunoId}/{cursoId}")
    public void deletar(@PathVariable Integer alunoId, @PathVariable Integer cursoId) {
        matriculaService.deletar(alunoId, cursoId);
    }
}
