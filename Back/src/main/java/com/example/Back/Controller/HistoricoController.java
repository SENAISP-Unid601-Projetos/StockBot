package com.example.Back.Controller;

import com.example.Back.Dto.HistoricoDTO;
import com.example.Back.Service.HistoricoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historico")
public class HistoricoController {

    @Autowired
    private HistoricoService historicoService;

    @GetMapping
    public ResponseEntity<List<HistoricoDTO>> getAllHistorico() {
        List<HistoricoDTO> historicos = historicoService.getAllHistorico();
        return ResponseEntity.ok(historicos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistoricoDTO> getHistoricoById(@PathVariable Long id) {
        return historicoService.getHistoricoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<HistoricoDTO> createHistorico(@RequestBody HistoricoDTO historicoDto) {
        HistoricoDTO novoHistorico = historicoService.createHistorico(historicoDto);
        return new ResponseEntity<>(novoHistorico, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistoricoDTO> updateHistorico(@PathVariable Long id, @RequestBody HistoricoDTO historicoDetailsDto) {
        return historicoService.updateHistorico(id, historicoDetailsDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHistorico(@PathVariable Long id) {
        if (historicoService.deleteHistorico(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

}