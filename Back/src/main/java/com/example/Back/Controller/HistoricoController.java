package com.example.Back.Controller;

import com.example.Back.Dto.HistoricoDTO;
import com.example.Back.Service.HistoricoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
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

    // Este é o método que o seu frontend vai chamar
    @GetMapping
    public ResponseEntity<Page<HistoricoDTO>> getHistoricoPaginado(
            // @PageableDefault define os valores padrão se o frontend não os enviar
            @PageableDefault(size = 10, sort = "dataHora", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<HistoricoDTO> historicoPage = historicoService.findAllPaginated(pageable);
        return ResponseEntity.ok(historicoPage);
    }
}