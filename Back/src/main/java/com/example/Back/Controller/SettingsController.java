package com.example.Back.Controller;

import com.example.Back.Dto.ThresholdDTO;
import com.example.Back.Service.SettingsService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private static final Logger logger = LoggerFactory.getLogger(SettingsController.class);
    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping("/lowStockThreshold")
    @PreAuthorize("isAuthenticated()") // Qualquer funcionário pode ver a regra
    public ResponseEntity<Integer> getLowStockThreshold() {
        int threshold = settingsService.getLowStockThreshold();
        return ResponseEntity.ok(threshold);
    }

    @PutMapping("/lowStockThreshold")
    @PreAuthorize("hasRole('ADMIN')") // Só o chefe muda a regra
    public ResponseEntity<Void> updateLowStockThreshold(@RequestBody @Valid ThresholdDTO dto) {
        logger.info("Atualizando nível de estoque baixo para: {}", dto.getThreshold());

        settingsService.updateLowStockThreshold(dto.getThreshold());

        return ResponseEntity.ok().build();
    }
}