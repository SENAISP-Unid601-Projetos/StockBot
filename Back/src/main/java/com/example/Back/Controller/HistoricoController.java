package com.example.Back.Controller;

import com.example.Back.Entity.Historico;
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

    // Endpoint para buscar todos os registros de histórico
    @GetMapping
    public ResponseEntity<List<Historico>> getAllHistorico() {
        List<Historico> historicos = historicoService.getAllHistorico();
        return ResponseEntity.ok(historicos);
    }

    // Endpoint para buscar um registro por ID
    @GetMapping("/{id}")
    public ResponseEntity<Historico> getHistoricoById(@PathVariable Long id) {
        return historicoService.getHistoricoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint para criar um novo registro
    @PostMapping
    public ResponseEntity<Historico> createHistorico(@RequestBody Historico historico) {
        Historico novoHistorico = historicoService.saveHistorico(historico);
        return new ResponseEntity<>(novoHistorico, HttpStatus.CREATED);
    }

    // Endpoint para atualizar um registro existente
    @PutMapping("/{id}")
    public ResponseEntity<Historico> updateHistorico(@PathVariable Long id, @RequestBody Historico historicoDetails) {
        return historicoService.updateHistorico(id, historicoDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint para deletar um registro por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHistorico(@PathVariable Long id) {
        if (historicoService.deleteHistorico(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}