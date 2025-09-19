package com.example.Back.Controller;

import com.example.Back.Dto.ThresholdDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    // Para simplificar, vamos guardar o limite na memória.
    // Numa aplicação real, isto viria de uma tabela 'settings' na base de dados.
    private final AtomicInteger lowStockThreshold = new AtomicInteger(5);

    // Endpoint para OBTER o limite atual
    @GetMapping("/lowStockThreshold")
    public ResponseEntity<Integer> getLowStockThreshold() {
        System.out.println("[SETTINGS CONTROLLER] GET /lowStockThreshold - Retornando: " + lowStockThreshold.get());
        return ResponseEntity.ok(lowStockThreshold.get());
    }

    // Endpoint para ATUALIZAR o limite (só para admins)
    @PutMapping("/lowStockThreshold")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateLowStockThreshold(@RequestBody ThresholdDTO dto) {
        System.out.println("[SETTINGS CONTROLLER] PUT /lowStockThreshold - Novo valor: " + dto.getThreshold());
        lowStockThreshold.set(dto.getThreshold());
        return ResponseEntity.ok().build();
    }
}
