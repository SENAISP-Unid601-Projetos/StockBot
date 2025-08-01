package com.example.Back.Controller;

import com.example.Back.DTO.ConfiguracaoCreateDTO;
import com.example.Back.DTO.ConfiguracaoResponseDTO;
import com.example.Back.DTO.ConfiguracaoUpdateDTO;
import com.example.Back.Service.ConfiguracaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/configuracoes")
@RequiredArgsConstructor
public class ConfiguracaoController {

    private final ConfiguracaoService service;

    @PostMapping
    public ResponseEntity<ConfiguracaoResponseDTO> criarConfiguracao(
            @RequestBody ConfiguracaoCreateDTO dto) {
        return new ResponseEntity<>(service.criarConfiguracao(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ConfiguracaoResponseDTO>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConfiguracaoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/chave/{chave}")
    public ResponseEntity<ConfiguracaoResponseDTO> buscarPorChave(@PathVariable String chave) {
        return ResponseEntity.ok(service.buscarPorChave(chave));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConfiguracaoResponseDTO> atualizarConfiguracao(
            @PathVariable Long id,
            @RequestBody ConfiguracaoUpdateDTO dto) {
        return ResponseEntity.ok(service.atualizarConfiguracao(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarConfiguracao(@PathVariable Long id) {
        service.deletarConfiguracao(id);
        return ResponseEntity.noContent().build();
    }
}
