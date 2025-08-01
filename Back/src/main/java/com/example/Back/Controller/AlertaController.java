// src/main/java/com/example/Back/Controller/AlertaController.java
package com.example.Back.Controller;

import com.example.Back.DTO.AlertaDTO;
import com.example.Back.DTO.ResolucaoAlertaDTO;
import com.example.Back.Service.AlertaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@RequiredArgsConstructor
public class AlertaController {
    private final AlertaService alertaService;

    @GetMapping("/pendentes")
    public ResponseEntity<List<AlertaDTO>> listarAlertasPendentes() {
        return ResponseEntity.ok(alertaService.listarAlertasPendentes());
    }

    @GetMapping("/pendentes/usuario/{usuarioId}")
    public ResponseEntity<List<AlertaDTO>> listarAlertasPendentesPorUsuario(
            @PathVariable Long usuarioId) {
        return ResponseEntity.ok(alertaService.listarAlertasPendentesPorUsuario(usuarioId));
    }
    @PatchMapping("/{id}/resolver")
    public ResponseEntity<AlertaDTO> resolverAlerta(
            @PathVariable Long id,
            @RequestBody @Valid ResolucaoAlertaDTO resolucaoDTO,
            @RequestHeader("X-Usuario-Id") Long usuarioId) {

        return ResponseEntity.ok(alertaService.resolverAlerta(id, resolucaoDTO, usuarioId));
    }

    @PatchMapping("/{id}/arquivar")
    public ResponseEntity<AlertaDTO> arquivarAlerta(
            @PathVariable Long id,
            @RequestHeader("X-Usuario-Id") Long usuarioId) {

        return ResponseEntity.ok(alertaService.arquivarAlerta(id, usuarioId));
    }
}