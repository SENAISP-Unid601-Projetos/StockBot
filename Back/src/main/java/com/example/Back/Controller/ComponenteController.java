package com.example.Back.Controller;

import com.example.Back.Dto.ComponenteDTO;
import com.example.Back.Service.ComponenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/componentes")
public class ComponenteController {

    private static final Logger logger = LoggerFactory.getLogger(ComponenteController.class);

    @Autowired
    private ComponenteService componenteService;

    // TODOS os utilizadores autenticados podem ver a lista
    @GetMapping
    public ResponseEntity<List<ComponenteDTO>> getAllComponentes() {
        logger.info("🔍 GET /api/componentes - Buscando todos os componentes");
        try {
            List<ComponenteDTO> componentes = componenteService.findAll();
            logger.info("✅ GET /api/componentes - Encontrados {} componentes", componentes.size());
            logger.debug("📦 Componentes encontrados: {}", componentes);
            return ResponseEntity.ok(componentes);
        } catch (Exception e) {
            logger.error("❌ GET /api/componentes - Erro ao buscar componentes: {}", e.getMessage());
            logger.debug("🔧 Stack trace: ", e);
            throw e; // Re-throw para manter o comportamento original
        }
    }

    // APENAS ADMINS podem criar um novo componente
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComponenteDTO> createComponente(@RequestBody ComponenteDTO componenteDTO) {
        logger.info("➕ POST /api/componentes - Criando novo componente");
        logger.debug("📋 Dados recebidos: {}", componenteDTO);

        try {
            ComponenteDTO novoComponente = componenteService.create(componenteDTO);
            logger.info("✅ POST /api/componentes - Componente criado com ID: {}", novoComponente.getId());
            logger.debug("📦 Componente criado: {}", novoComponente);
            return ResponseEntity.ok(novoComponente);
        } catch (Exception e) {
            logger.error("❌ POST /api/componentes - Erro ao criar componente: {}", e.getMessage());
            logger.debug("🔧 Stack trace: ", e);
            throw e;
        }
    }

    // APENAS ADMINS podem atualizar um componente
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComponenteDTO> updateComponente(@PathVariable Long id, @RequestBody ComponenteDTO componenteDTO) {
        logger.info("✏️  PUT /api/componentes/{} - Atualizando componente", id);
        logger.debug("📋 Dados recebidos para atualização: {}", componenteDTO);

        try {
            ComponenteDTO componenteAtualizado = componenteService.update(id, componenteDTO);
            logger.info("✅ PUT /api/componentes/{} - Componente atualizado com sucesso", id);
            logger.debug("📦 Componente atualizado: {}", componenteAtualizado);
            return ResponseEntity.ok(componenteAtualizado);
        } catch (Exception e) {
            logger.error("❌ PUT /api/componentes/{} - Erro ao atualizar componente: {}", id, e.getMessage());
            logger.debug("🔧 Stack trace: ", e);
            throw e;
        }
    }

    // APENAS ADMINS podem apagar um componente
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteComponente(@PathVariable Long id) {
        logger.info("🗑️  DELETE /api/componentes/{} - Excluindo componente", id);

        try {
            componenteService.delete(id);
            logger.info("✅ DELETE /api/componentes/{} - Componente excluído com sucesso", id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("❌ DELETE /api/componentes/{} - Erro ao excluir componente: {}", id, e.getMessage());
            logger.debug("🔧 Stack trace: ", e);
            throw e;
        }
    }
}