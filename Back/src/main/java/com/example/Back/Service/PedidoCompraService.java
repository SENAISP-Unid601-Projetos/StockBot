package com.example.Back.Service;

import com.example.Back.Dto.PedidoCompraCreateDTO;
import com.example.Back.Dto.MeusPedidosCompraDTO;
import com.example.Back.Dto.RequisicaoDTO;
import com.example.Back.Entity.Componente;
import com.example.Back.Entity.Empresa;
import com.example.Back.Entity.PedidoCompra;
import com.example.Back.Entity.Usuario;
import com.example.Back.Repository.ComponenteRepository;
import com.example.Back.Repository.PedidoCompraRepository;
import com.example.Back.Repository.UsuarioRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PedidoCompraService {

    private final PedidoCompraRepository pedidoCompraRepository;
    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final ComponenteRepository componenteRepository; // Injeção nova

    public PedidoCompraService(PedidoCompraRepository pedidoCompraRepository, UsuarioService usuarioService, UsuarioRepository usuarioRepository, ComponenteRepository componenteRepository) {
        this.pedidoCompraRepository = pedidoCompraRepository;
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.componenteRepository = componenteRepository;
    }

    @Transactional
    public void createPedido(PedidoCompraCreateDTO dto) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        String emailUsuario = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario solicitante = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));

        PedidoCompra pedido = new PedidoCompra();

        // LÓGICA NOVA: Verificar se é item existente
        if (dto.getComponenteId() != null) {
            Componente comp = componenteRepository.findByIdAndEmpresaId(dto.getComponenteId(), empresa.getId())
                    .orElseThrow(() -> new RuntimeException("Componente não encontrado"));
            pedido.setComponenteExistente(comp);
            pedido.setNomeItem(comp.getNome());
        } else {
            if (dto.getNomeItem() == null || dto.getNomeItem().isBlank()) {
                throw new IllegalArgumentException("Nome do item é obrigatório para novos itens.");
            }
            pedido.setNomeItem(dto.getNomeItem());
        }

        pedido.setQuantidade(dto.getQuantidade());
        pedido.setJustificativa(dto.getJustificativa());
        pedido.setSolicitante(solicitante);
        pedido.setEmpresa(empresa);

        pedidoCompraRepository.save(pedido);
    }

    @Transactional(readOnly = true)
    public List<MeusPedidosCompraDTO> findMeusPedidos() {
        String emailUsuario = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario solicitante = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));

        List<PedidoCompra> pedidos = pedidoCompraRepository.findAllBySolicitanteId(solicitante.getId());
        return pedidos.stream().map(this::toMeusPedidosDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RequisicaoDTO> findPendentesByEmpresa() {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        List<PedidoCompra> pedidos = pedidoCompraRepository.findAllByEmpresaIdAndStatus(empresa.getId(), "PENDENTE");
        return pedidos.stream().map(this::toAprovacaoDTO).collect(Collectors.toList());
    }

    // NOVO MÉTODO: Buscar pedidos APROVADOS (para a tela de Recebimento)
    @Transactional(readOnly = true)
    public List<RequisicaoDTO> findAprovadosByEmpresa() {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        List<PedidoCompra> pedidos = pedidoCompraRepository.findAllByEmpresaIdAndStatus(empresa.getId(), "APROVADO");
        return pedidos.stream().map(this::toAprovacaoDTO).collect(Collectors.toList());
    }

    @Transactional
    public void aprovarPedidoCompra(Long pedidoId) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        PedidoCompra pedido = pedidoCompraRepository.findByIdAndEmpresaId(pedidoId, empresa.getId())
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado."));

        if (!pedido.getStatus().equals("PENDENTE")) {
            throw new RuntimeException("Apenas pedidos PENDENTES podem ser aprovados.");
        }

        pedido.setStatus("APROVADO");
        pedidoCompraRepository.save(pedido);
    }

    @Transactional
    public void recusarPedidoCompra(Long pedidoId) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        PedidoCompra pedido = pedidoCompraRepository.findByIdAndEmpresaId(pedidoId, empresa.getId())
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado."));

        if (!pedido.getStatus().equals("PENDENTE")) {
            throw new RuntimeException("Apenas pedidos PENDENTES podem ser recusados.");
        }

        pedido.setStatus("RECUSADO");
        pedidoCompraRepository.save(pedido);
    }

    // --- NOVO MÉTODO: CONFIRMAR RECEBIMENTO E ATUALIZAR ESTOQUE ---
    @Transactional
    public void confirmarRecebimento(Long pedidoId) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        PedidoCompra pedido = pedidoCompraRepository.findByIdAndEmpresaId(pedidoId, empresa.getId())
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado."));

        if (!"APROVADO".equals(pedido.getStatus())) {
            throw new RuntimeException("Apenas pedidos APROVADOS podem ser recebidos.");
        }

        // 1. Se o item JÁ EXISTE, atualiza o estoque
        if (pedido.getComponenteExistente() != null) {
            Componente comp = pedido.getComponenteExistente();
            comp.setQuantidade(comp.getQuantidade() + pedido.getQuantidade());
            componenteRepository.save(comp);
        }
        // 2. Se é ITEM NOVO, cria o componente automaticamente
        else {
            Componente novoComp = new Componente();
            novoComp.setNome(pedido.getNomeItem());
            novoComp.setQuantidade(pedido.getQuantidade());
            novoComp.setEmpresa(empresa);
            novoComp.setLocalizacao("Almoxarifado");
            novoComp.setCategoria("Geral");
            novoComp.setNivelMinimoEstoque(5); // Padrão

            // Gera código
            String codigoGerado = empresa.getDominio().toUpperCase() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            novoComp.setCodigoPatrimonio(codigoGerado);

            componenteRepository.save(novoComp);
        }

        pedido.setStatus("RECEBIDO");
        pedidoCompraRepository.save(pedido);
    }
    // --------------------------------------------------------------

    private MeusPedidosCompraDTO toMeusPedidosDTO(PedidoCompra pedido) {
        return new MeusPedidosCompraDTO(
                pedido.getId(),
                pedido.getNomeItem(),
                pedido.getQuantidade(),
                pedido.getDataPedido(),
                pedido.getStatus()
        );
    }

    private RequisicaoDTO toAprovacaoDTO(PedidoCompra pedido) {
        String solicitanteEmail = (pedido.getSolicitante() != null)
                ? pedido.getSolicitante().getEmail()
                : "Solicitante desconhecido";

        return new RequisicaoDTO(
                pedido.getId(),
                pedido.getNomeItem(),
                pedido.getQuantidade(),
                pedido.getJustificativa(),
                solicitanteEmail,
                pedido.getDataPedido()
        );
    }
}