package com.example.Back.Controller;

import com.example.Back.Dto.ComponenteDTO;
import com.example.Back.Service.ComponenteService;
import org.springframework.core.io.InputStreamResource; // <--- Importante para Exportar
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;          // <--- Importante para Cabeçalhos
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // <--- Importante para Importar

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/componentes")
public class ComponenteController {

    private final ComponenteService componenteService;

    public ComponenteController(ComponenteService componenteService) {
        this.componenteService = componenteService;
    }

    // --- GET (Listagem) ---
    @GetMapping
    public ResponseEntity<List<ComponenteDTO>> getAllComponentes(
            @RequestParam(value = "termo", required = false) String termoDeBusca) {
        List<ComponenteDTO> componentes = componenteService.findAll(termoDeBusca);
        return ResponseEntity.ok(componentes);
    }

    // --- POST (Criar um) ---
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComponenteDTO> createComponente(@RequestBody ComponenteDTO componenteDTO) {
        ComponenteDTO novoComponente = componenteService.create(componenteDTO);
        return ResponseEntity.ok(novoComponente);
    }

    // --- PUT (Atualizar) ---
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComponenteDTO> updateComponente(@PathVariable Long id, @RequestBody ComponenteDTO componenteDTO) {
        ComponenteDTO componenteAtualizado = componenteService.update(id, componenteDTO);
        return ResponseEntity.ok(componenteAtualizado);
    }

    // --- DELETE (Excluir) ---
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteComponente(@PathVariable Long id) {
        componenteService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ========================================================================
    // --- NOVOS MÉTODOS PARA CSV (WEB COMPATÍVEL) ---
    // ========================================================================

    // 1. IMPORTAR (Upload de arquivo)
    @PostMapping("/importar")
    @PreAuthorize("hasRole('ADMIN')") // Só admin deve poder alterar o banco em massa
    public ResponseEntity<String> importarCsv(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Erro: O arquivo está vazio.");
        }

        try {
            // O serviço vai ler os bytes do arquivo e salvar no banco
            componenteService.importarComponentesViaCsv(file);
            return ResponseEntity.ok("Importação realizada com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao importar CSV: " + e.getMessage());
        }
    }

    // 2. EXPORTAR (Download de arquivo)
    @GetMapping("/exportar")
    // Pode ser liberado para todos ou só admin, você decide. Tire o PreAuthorize se todos puderem baixar.
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> exportarCsv() {
        // O serviço gera o CSV na memória e devolve um Stream (fluxo de dados)
        ByteArrayInputStream stream = componenteService.gerarCsvDeComponentes();

        HttpHeaders headers = new HttpHeaders();
        // Essa linha avisa o navegador: "Ei, isso é um download chamado componentes.csv"
        headers.add("Content-Disposition", "attachment; filename=componentes.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/csv")) // Tipo do arquivo
                .body(new InputStreamResource(stream));
    }
}