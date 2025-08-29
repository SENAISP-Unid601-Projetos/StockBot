package com.example.Back.Controller;

import com.example.Back.Dto.ThresholdDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final AtomicInteger lowStockThreshold = new AtomicInteger(5);

    // Endpoint para OBTER o limite atual
    @GetMapping("/lowStockThreshold")
    public ResponseEntity<Integer> getLowStockThreshold() {
        System.out.println("=== [DEBUG] SettingsController.getLowStockThreshold() chamado ===");
        System.out.println("[DEBUG] Método: GET /api/settings/lowStockThreshold");

        int currentThreshold = lowStockThreshold.get();
        System.out.println("[DEBUG] Valor atual do threshold: " + currentThreshold);
        System.out.println("[DEBUG] Retornando status 200 com valor: " + currentThreshold);

        return ResponseEntity.ok(currentThreshold);
    }

    // Endpoint para ATUALIZAR o limite (só para admins)
    @PutMapping("/lowStockThreshold")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateLowStockThreshold(@RequestBody ThresholdDTO dto) {
        System.out.println("=== [DEBUG] SettingsController.updateLowStockThreshold() chamado ===");
        System.out.println("[DEBUG] Método: PUT /api/settings/lowStockThreshold");
        System.out.println("[DEBUG] Verificando permissões ADMIN...");

        try {
            int newThreshold = dto.getThreshold();
            System.out.println("[DEBUG] Novo valor recebido: " + newThreshold);

            // Validação básica
            if (newThreshold < 0) {
                System.out.println("[DEBUG] ERRO: Threshold não pode ser negativo. Valor recebido: " + newThreshold);
                return ResponseEntity.badRequest().build();
            }

            int oldValue = lowStockThreshold.getAndSet(newThreshold);
            System.out.println("[DEBUG] Threshold atualizado com sucesso!");
            System.out.println("[DEBUG] Valor anterior: " + oldValue + " | Novo valor: " + newThreshold);
            System.out.println("[DEBUG] Retornando status 200 OK");

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            System.out.println("[DEBUG] ERRO inesperado ao atualizar threshold: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}