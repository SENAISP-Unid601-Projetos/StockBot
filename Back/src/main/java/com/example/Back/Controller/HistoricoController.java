package com.example.Back.Controller;

import com.example.Back.Dto.HistoricoDTO;
import com.example.Back.Service.HistoricoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // Importante
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/historico")
public class HistoricoController {

    private final HistoricoService historicoService;

    public HistoricoController(HistoricoService historicoService) {
        this.historicoService = historicoService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()") // Segurança: Só usuários logados veem histórico
    public ResponseEntity<Page<HistoricoDTO>> getHistoricoPaginado(
            // Padrão: 10 itens, ordenados do mais recente para o mais antigo (DESC)
            @PageableDefault(size = 10, sort = "dataHora", direction = Sort.Direction.DESC) Pageable pageable) {

        return ResponseEntity.ok(historicoService.findAllPaginated(pageable));
    }
}