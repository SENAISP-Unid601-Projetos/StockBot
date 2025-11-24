package com.example.Back.Controller;

import com.example.Back.Dto.RequisicaoDTO;
import com.example.Back.Service.RequisicaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requisicoes")
public class RequisicaoController {

    private final RequisicaoService requisicaoService;

    public RequisicaoController(RequisicaoService requisicaoService) {
        this.requisicaoService = requisicaoService;
    }

    @GetMapping("/pendentes")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<RequisicaoDTO>> getRequisicoesPendentes() {
        return ResponseEntity.ok(requisicaoService.findPendentesByEmpresa());
    }

    @PutMapping("/{id}/concluir")
    @PreAuthorize("hasRole('ADMIN')") // Só Admin conclui requisição (Segurança extra)
    public ResponseEntity<Void> concluirRequisicao(@PathVariable Long id) {
        try {
            requisicaoService.concluirRequisicaoByEmpresa(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}