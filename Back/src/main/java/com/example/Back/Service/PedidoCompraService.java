package com.example.Back.Service;

import com.example.Back.Dto.PedidoCompraCreateDTO;
import com.example.Back.Dto.PedidoCompraDTO;
import com.example.Back.Entity.PedidoCompra;
import com.example.Back.Entity.Usuario;
import com.example.Back.Repository.PedidoCompraRepository;
import com.example.Back.Repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoCompraService {

    private final PedidoCompraRepository pedidoCompraRepository;
    private final UsuarioRepository usuarioRepository;

    public PedidoCompraService(PedidoCompraRepository pedidoCompraRepository, UsuarioRepository usuarioRepository) {
        this.pedidoCompraRepository = pedidoCompraRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // Para o Usuário criar um pedido
    @Transactional
    public PedidoCompra createPedido(PedidoCompraCreateDTO dto) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        PedidoCompra pedido = new PedidoCompra();
        pedido.setNomeItem(dto.getNomeItem());
        pedido.setQuantidade(dto.getQuantidade());
        pedido.setJustificativa(dto.getJustificativa());
        pedido.setUsuario(usuario);
        pedido.setStatus("PENDENTE");
        pedido.setDataPedido(new Date());

        return pedidoCompraRepository.save(pedido);
    }

    // Para o Usuário ver seus pedidos
    @Transactional(readOnly = true)
    public List<PedidoCompraDTO> findMeusPedidos() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return pedidoCompraRepository.findByUsuarioId(usuario.getId())
                .stream().map(PedidoCompraDTO::new).collect(Collectors.toList());
    }

    // Para o Admin ver os pendentes
    @Transactional(readOnly = true)
    public Page<PedidoCompraDTO> findPendentes(Pageable pageable) {
        return pedidoCompraRepository.findByStatus("PENDENTE", pageable)
                .map(PedidoCompraDTO::new);
    }

    // Para o Admin aprovar
    @Transactional
    public void aprovarPedido(Long id) {
        PedidoCompra pedido = pedidoCompraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        pedido.setStatus("APROVADO");
        pedidoCompraRepository.save(pedido);
    }

    // Para o Admin recusar
    @Transactional
    public void recusarPedido(Long id) {
        PedidoCompra pedido = pedidoCompraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        pedido.setStatus("RECUSADO");
        pedidoCompraRepository.save(pedido);
    }
}