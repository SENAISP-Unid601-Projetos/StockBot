package com.example.Back.Controller;

import com.example.Back.Dto.RequisicaoDTO;
import com.example.Back.Entity.Requisicao; // Importar
import com.example.Back.Service.RequisicaoService; // Importar
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // Importar
import org.springframework.web.bind.annotation.*;

import java.util.List; // Importar

@RestController
@RequestMapping("/api/requisicoes")
public class RequisicaoController {

    private final RequisicaoService requisicaoService;

    // Injeção do serviço
    public RequisicaoController(RequisicaoService requisicaoService) {
        this.requisicaoService = requisicaoService;
    }

    /**
     * Endpoint para buscar todas as requisições pendentes da empresa do utilizador logado.
     * Chamado pela página 'requisicaopage.jsx'.
     */
    @GetMapping("/pendentes")
    @PreAuthorize("isAuthenticated()") // Acessível por ADMIN e USER
    public ResponseEntity<List<RequisicaoDTO>> getRequisicoesPendentes() {
        List<RequisicaoDTO> requisicoes = requisicaoService.findPendentesByEmpresa();
        return ResponseEntity.ok(requisicoes);
    }

    /**
     * Endpoint para marcar uma requisição como concluída.
     * Chamado pela página 'requisicaopage.jsx'.
     */
    @PutMapping("/{id}/concluir")
    @PreAuthorize("isAuthenticated()") // Acessível por ADMIN e USER
    public ResponseEntity<Void> concluirRequisicao(@PathVariable Long id) {
        try {
            requisicaoService.concluirRequisicaoByEmpresa(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            // Retorna 404 Not Found se a requisição não existir ou não pertencer à empresa
            return ResponseEntity.notFound().build();
        }
    }
}