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

    /**
     * Endpoint para criar um novo pedido de compra (usado pelo formulário).
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()") // Qualquer utilizador logado pode pedir
    public ResponseEntity<Void> createPedido(@RequestBody @Valid PedidoCompraCreateDTO dto) {
        try {
            pedidoCompraService.createPedido(dto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Endpoint para listar os pedidos do próprio utilizador (usado pela tabela).
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MeusPedidosCompraDTO>> getMeusPedidos() {
        List<MeusPedidosCompraDTO> pedidos = pedidoCompraService.findMeusPedidos();
        return ResponseEntity.ok(pedidos);
    }

    /**
     * Endpoint para listar pedidos de compra pendentes (para Admin).
     */
    @GetMapping("/pendentes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List< RequisicaoDTO>> getPedidosPendentes() {
        List<RequisicaoDTO> pedidos = pedidoCompraService.findPendentesByEmpresa();
        return ResponseEntity.ok(pedidos);
    }

    /**
     * Endpoint para APROVAR um pedido de compra. (ADMIN)
     */
    @PutMapping("/{id}/aprovar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> aprovarPedido(@PathVariable Long id) {
        try {
            pedidoCompraService.aprovarPedidoCompra(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null); // Retorna 400 se algo der errado
        }
    }

    /**
     * Endpoint para RECUSAR um pedido de compra. (ADMIN)
     */
    @PutMapping("/{id}/recusar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> recusarPedido(@PathVariable Long id) {
        try {
            pedidoCompraService.recusarPedidoCompra(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null); // Retorna 400 se algo der errado
        }
    }
}