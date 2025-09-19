package com.example.Back.Controller;

import com.example.Back.Dto.ComponenteDTO;
import com.example.Back.Service.ComponenteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/componentes")
public class ComponenteController {

    private final ComponenteService componenteService;

    public ComponenteController(ComponenteService componenteService) {
        this.componenteService = componenteService;
    }

    // --- MÉTODO GET CORRIGIDO PARA ACEITAR BUSCA ---
    @GetMapping
    public ResponseEntity<List> getAllComponentes(
// @RequestParam pega um parâmetro da URL, como "?termo=parafuso"
// required = false significa que o parâmetro é opcional
            @RequestParam(value = "termo", required = false) String termoDeBusca) {

// Passa o termo de busca (que pode ser null) para o service
        List<ComponenteDTO> componentes = componenteService.findAll(termoDeBusca);
        return ResponseEntity.ok(componentes);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity createComponente(@RequestBody ComponenteDTO componenteDTO) {
        ComponenteDTO novoComponente = componenteService.create(componenteDTO);
        return ResponseEntity.ok(novoComponente);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity updateComponente(@PathVariable Long id, @RequestBody ComponenteDTO componenteDTO) {
        ComponenteDTO componenteAtualizado = componenteService.update(id, componenteDTO);
        return ResponseEntity.ok(componenteAtualizado);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity deleteComponente(@PathVariable Long id) {
        componenteService.delete(id);
        return ResponseEntity.noContent().build();
    }

}