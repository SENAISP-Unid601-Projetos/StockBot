package com.example.Back.Service;

import com.example.Back.Dto.PedidoCompraCreateDTO;
import com.example.Back.Dto.MeusPedidosCompraDTO;
import com.example.Back.Entity.Empresa;
import com.example.Back.Entity.PedidoCompra;
import com.example.Back.Entity.Usuario;
import com.example.Back.Repository.PedidoCompraRepository;
import com.example.Back.Repository.UsuarioRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoCompraService {

    private final PedidoCompraRepository pedidoCompraRepository;
    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;

    public PedidoCompraService(PedidoCompraRepository pedidoCompraRepository, UsuarioService usuarioService, UsuarioRepository usuarioRepository) {
        this.pedidoCompraRepository = pedidoCompraRepository;
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Cria um novo pedido de compra.
     */
    @Transactional
    public void createPedido(PedidoCompraCreateDTO dto) {
        // Pega a empresa e o utilizador logado
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        String emailUsuario = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario solicitante = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));

        PedidoCompra pedido = new PedidoCompra();
        pedido.setNomeItem(dto.getNomeItem());
        pedido.setQuantidade(dto.getQuantidade());
        pedido.setJustificativa(dto.getJustificativa());
        pedido.setStatus("PENDENTE");
        pedido.setDataPedido(LocalDateTime.now());
        pedido.setSolicitante(solicitante);
        pedido.setEmpresa(empresa);

        pedidoCompraRepository.save(pedido);
    }

    /**
     * Lista os pedidos feitos pelo utilizador logado.
     */
    @Transactional(readOnly = true)
    public List<MeusPedidosCompraDTO> findMeusPedidos() {
        String emailUsuario = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario solicitante = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));

        List<PedidoCompra> pedidos = pedidoCompraRepository.findAllBySolicitanteId(solicitante.getId());

        return pedidos.stream()
                .map(this::toMeusPedidosCompraDTO)
                .collect(Collectors.toList());
    }

    // Converte a Entidade para o DTO que a tabela do frontend espera
    private MeusPedidosCompraDTO toMeusPedidosDTO(PedidoCompra pedido) {
        return new MeusPedidosCompraDTO(
                pedido.getId(),
                pedido.getNomeItem(),
                pedido.getQuantidade(),
                pedido.getDataPedido(),
                pedido.getStatus()
        );
    }
}