package com.example.Back.Controller;

import com.example.Back.Dto.PedidoCompraCreateDTO;
import com.example.Back.Dto.MeusPedidosCompraDTO;
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
}