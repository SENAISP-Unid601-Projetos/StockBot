package com.example.Back.Controller;

import com.example.Back.Dto.ThresholdDTO;
import com.example.Back.Service.SettingsService; // <-- Agora o Java vai encontrar este ficheiro
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
// Não precisamos mais do AtomicInteger

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    // Remove a variável antiga
    // private final AtomicInteger lowStockThreshold = new AtomicInteger(5);

    private final SettingsService settingsService; // <-- Adiciona o serviço

    // Injeta o SettingsService
    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    // Modifica o GET para usar o serviço
    @GetMapping("/lowStockThreshold")
    @PreAuthorize("isAuthenticated()") // Permite que USERs leiam
    public ResponseEntity<Integer> getLowStockThreshold() {
        int threshold = settingsService.getLowStockThreshold(); // Usa o serviço
        System.out.println("[SETTINGS CONTROLLER] GET /lowStockThreshold - Retornando: " + threshold);
        return ResponseEntity.ok(threshold);
    }

    // Modifica o PUT para usar o serviço
    @PutMapping("/lowStockThreshold")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateLowStockThreshold(@RequestBody ThresholdDTO dto) {
        System.out.println("[SETTINGS CONTROLLER] PUT /lowStockThreshold - Novo valor: " + dto.getThreshold());
        settingsService.updateLowStockThreshold(dto.getThreshold()); // Usa o serviço
        return ResponseEntity.ok().build();
    }
}