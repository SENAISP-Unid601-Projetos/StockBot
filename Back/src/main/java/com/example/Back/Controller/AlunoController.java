package com.example.Back.Controller;

import com.example.Back.DTO.AlunoCreatedDTO;
import com.example.Back.DTO.AlunoDTO;
import com.example.Back.DTO.LoginRequestDTO;
import com.example.Back.Service.AlunoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    private final AlunoService alunoService;

    @Autowired
    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @PostMapping
    public ResponseEntity<AlunoDTO> criarAluno(@RequestBody AlunoCreatedDTO alunoCreatedDTO) {
        AlunoDTO alunoDTO = alunoService.criarAluno(alunoCreatedDTO);
        return ResponseEntity.ok(alunoDTO);
    }

    @GetMapping
    public ResponseEntity<List<AlunoDTO>> listarTodosAlunos() {
        List<AlunoDTO> alunos = alunoService.listarTodosAlunos();
        return ResponseEntity.ok(alunos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlunoDTO> buscarAlunoPorId(@PathVariable Long id) {
        AlunoDTO alunoDTO = alunoService.buscarAlunoPorId(id);
        return ResponseEntity.ok(alunoDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlunoDTO> atualizarAluno(@PathVariable Long id, @RequestBody AlunoDTO alunoDTO) {
        AlunoDTO updatedAlunoDTO = alunoService.atualizarAluno(id, alunoDTO);
        return ResponseEntity.ok(updatedAlunoDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAluno(@PathVariable Long id) {
        alunoService.deletarAluno(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscarPorNome")
    public ResponseEntity<List<AlunoDTO>> buscarAlunosPorNome(@RequestParam String nome) {
        List<AlunoDTO> alunos = alunoService.buscarAlunosPorNome(nome);
        return ResponseEntity.ok(alunos);
    }

    @PostMapping("/login")
    public ResponseEntity<AlunoDTO> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        AlunoDTO alunoDTO = alunoService.login(loginRequestDTO.getEmail(), loginRequestDTO.getSenha()); // Changed to getSenha
        return ResponseEntity.ok(alunoDTO);
    }
}