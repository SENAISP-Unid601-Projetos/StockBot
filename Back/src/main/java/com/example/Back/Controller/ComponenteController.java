package com.example.Back.Controller;

import com.example.Back.Dto.ComponenteDTO;
import com.example.Back.Service.ComponenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // Import necessário
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/componentes")
public class ComponenteController {

    @Autowired
    private ComponenteService componenteService;

    // TODOS os utilizadores autenticados podem ver a lista
    @GetMapping
    public ResponseEntity<List<ComponenteDTO>> getAllComponentes() {
        return ResponseEntity.ok(componenteService.findAll());
    }

    // APENAS ADMINS podem criar um novo componente
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComponenteDTO> createComponente(@RequestBody ComponenteDTO componenteDTO) {
        ComponenteDTO novoComponente = componenteService.create(componenteDTO);
        return ResponseEntity.ok(novoComponente);
    }

    // APENAS ADMINS podem atualizar um componente
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComponenteDTO> updateComponente(@PathVariable Long id, @RequestBody ComponenteDTO componenteDTO) {
        ComponenteDTO componenteAtualizado = componenteService.update(id, componenteDTO);
        return ResponseEntity.ok(componenteAtualizado);
    }

    // APENAS ADMINS podem apagar um componente
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteComponente(@PathVariable Long id) {
        componenteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
