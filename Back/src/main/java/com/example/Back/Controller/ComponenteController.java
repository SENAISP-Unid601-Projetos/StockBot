package com.example.Back.Controller;

import com.example.Back.Dto.ComponenteDTO;
import com.example.Back.Service.ComponenteService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/componentes")
public class ComponenteController {

    private final ComponenteService componenteService;

    public ComponenteController(ComponenteService componenteService) {
        this.componenteService = componenteService;
    }

    // --- GET (Listagem - Aberto ou Autenticado dependendo do SecurityConfig) ---
    @GetMapping
    public ResponseEntity<List<ComponenteDTO>> getAllComponentes(
            @RequestParam(value = "termo", required = false) String termoDeBusca) {
        List<ComponenteDTO> componentes = componenteService.findAll(termoDeBusca);
        return ResponseEntity.ok(componentes);
    }

    // --- POST (Criar) ---
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // <--- MUDANÇA: Padronizado para hasRole
    public ResponseEntity<ComponenteDTO> createComponente(@RequestBody ComponenteDTO componenteDTO) {
        ComponenteDTO novoComponente = componenteService.create(componenteDTO);
        return ResponseEntity.ok(novoComponente);
    }

    // --- PUT (Atualizar) ---
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // <--- MUDANÇA: Padronizado para hasRole
    public ResponseEntity<ComponenteDTO> updateComponente(@PathVariable Long id, @RequestBody ComponenteDTO componenteDTO) {
        ComponenteDTO componenteAtualizado = componenteService.update(id, componenteDTO);
        return ResponseEntity.ok(componenteAtualizado);
    }

    // --- DELETE (Excluir) ---
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // <--- MUDANÇA: Padronizado para hasRole
    public ResponseEntity<Void> deleteComponente(@PathVariable Long id) {
        componenteService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ========================================================================
    // --- MÉTODOS DE IMPORTAÇÃO E EXPORTAÇÃO ---
    // ========================================================================

    // 1. IMPORTAR CSV
    @PostMapping("/importar")
    @PreAuthorize("hasRole('ADMIN')") // <--- Já estava certo, mantivemos
    public ResponseEntity<String> importarCsv(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Erro: O arquivo está vazio.");
        }
        try {
            componenteService.importarComponentesViaCsv(file);
            return ResponseEntity.ok("Importação realizada com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao importar CSV: " + e.getMessage());
        }
    }

    // 2. EXPORTAR CSV
    @GetMapping("/exportar")
    @PreAuthorize("hasRole('ADMIN')") // <--- MUDANÇA: Padronizado para hasRole
    public ResponseEntity<Resource> exportarCsv() {
        ByteArrayInputStream stream = componenteService.gerarCsvDeComponentes();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=estoque.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/csv"))
                .body(new InputStreamResource(stream));
    }
}