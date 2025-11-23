package com.example.Back.Controller;

import com.example.Back.Dto.PedidoCompraCreateDTO;
import com.example.Back.Dto.MeusPedidosCompraDTO;
import com.example.Back.Dto.RequisicaoDTO;
import com.example.Back.Service.PedidoCompraService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos-compra")
public class PedidoCompraController {

    private final PedidoCompraService pedidoCompraService;

    public PedidoCompraController(PedidoCompraService pedidoCompraService) {
        this.pedidoCompraService = pedidoCompraService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> createPedido(@RequestBody @Valid PedidoCompraCreateDTO dto) {
        try {
            pedidoCompraService.createPedido(dto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MeusPedidosCompraDTO>> getMeusPedidos() {
        List<MeusPedidosCompraDTO> pedidos = pedidoCompraService.findMeusPedidos();
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/pendentes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RequisicaoDTO>> getPedidosPendentes() {
        List<RequisicaoDTO> pedidos = pedidoCompraService.findPendentesByEmpresa();
        return ResponseEntity.ok(pedidos);
    }

    // NOVO: Endpoint para listar Aprovados (Recebimento)
    @GetMapping("/aprovados")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RequisicaoDTO>> getPedidosAprovados() {
        List<RequisicaoDTO> pedidos = pedidoCompraService.findAprovadosByEmpresa();
        return ResponseEntity.ok(pedidos);
    }

    @PutMapping("/{id}/aprovar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> aprovarPedido(@PathVariable Long id) {
        try {
            pedidoCompraService.aprovarPedidoCompra(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/recusar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> recusarPedido(@PathVariable Long id) {
        try {
            pedidoCompraService.recusarPedidoCompra(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // NOVO: Endpoint para Confirmar Recebimento
    @PutMapping("/{id}/receber")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> receberPedido(@PathVariable Long id) {
        try {
            pedidoCompraService.confirmarRecebimento(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}