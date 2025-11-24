package com.example.Back.Service;

import com.example.Back.Dto.PedidoCompraCreateDTO;
import com.example.Back.Dto.MeusPedidosCompraDTO;
import com.example.Back.Dto.RequisicaoDTO; // Reutilizamos para a lista de aprovação
import com.example.Back.Entity.Componente;
import com.example.Back.Entity.Empresa;
import com.example.Back.Entity.PedidoCompra;
import com.example.Back.Entity.Usuario;
import com.example.Back.Entity.TipoMovimentacao; // Importar para gerar histórico
import com.example.Back.Repository.ComponenteRepository;
import com.example.Back.Repository.PedidoCompraRepository;
import com.example.Back.Repository.UsuarioRepository;
import com.example.Back.Repository.HistoricoRepository; // Importar
import com.example.Back.Entity.Historico; // Importar
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
    private final ComponenteRepository componenteRepository;
    private final HistoricoRepository historicoRepository; // Para registrar a entrada no histórico

    public PedidoCompraService(PedidoCompraRepository pedidoCompraRepository, UsuarioService usuarioService, UsuarioRepository usuarioRepository, ComponenteRepository componenteRepository, HistoricoRepository historicoRepository) {
        this.pedidoCompraRepository = pedidoCompraRepository;
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.componenteRepository = componenteRepository;
        this.historicoRepository = historicoRepository;
    }

    @Transactional
    public void createPedido(PedidoCompraCreateDTO dto) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        String emailUsuario = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario solicitante = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));

        PedidoCompra pedido = new PedidoCompra();
        pedido.setQuantidade(dto.getQuantidade());
        pedido.setJustificativa(dto.getJustificativa());
        pedido.setSolicitante(solicitante);
        pedido.setEmpresa(empresa);
        pedido.setStatus("PENDENTE"); // Garante status inicial

        // Lógica Inteligente: Item Novo vs Existente
        if (dto.getComponenteId() != null) {
            Componente comp = componenteRepository.findByIdAndEmpresaId(dto.getComponenteId(), empresa.getId())
                    .orElseThrow(() -> new RuntimeException("Componente não encontrado"));
            pedido.setComponenteExistente(comp);
            pedido.setNomeItem(comp.getNome()); // Usa o nome oficial do componente
        } else {
            if (dto.getNomeItem() == null || dto.getNomeItem().isBlank()) {
                throw new IllegalArgumentException("Nome do item é obrigatório para novos itens.");
            }
            pedido.setNomeItem(dto.getNomeItem());
        }

        pedidoCompraRepository.save(pedido);
    }

    // ... (Métodos de busca findMeusPedidos e findPendentes iguais ao seu, só ajustados pelo Repository novo) ...
    @Transactional(readOnly = true)
    public List<MeusPedidosCompraDTO> findMeusPedidos() {
        String emailUsuario = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario solicitante = usuarioRepository.findByEmail(emailUsuario).orElseThrow();
        return pedidoCompraRepository.findAllBySolicitanteIdOrderByDataPedidoDesc(solicitante.getId())
                .stream().map(this::toMeusPedidosDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RequisicaoDTO> findPendentesByEmpresa() {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        return pedidoCompraRepository.findAllByEmpresaIdAndStatusOrderByDataPedidoDesc(empresa.getId(), "PENDENTE")
                .stream().map(this::toAprovacaoDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RequisicaoDTO> findAprovadosByEmpresa() {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        return pedidoCompraRepository.findAllByEmpresaIdAndStatusOrderByDataPedidoDesc(empresa.getId(), "APROVADO")
                .stream().map(this::toAprovacaoDTO).collect(Collectors.toList());
    }

    @Transactional
    public void aprovarPedidoCompra(Long pedidoId) {
        alterarStatusPedido(pedidoId, "PENDENTE", "APROVADO");
    }

    @Transactional
    public void recusarPedidoCompra(Long pedidoId) {
        alterarStatusPedido(pedidoId, "PENDENTE", "RECUSADO");
    }

    // Helper privado para evitar repetição de código
    private void alterarStatusPedido(Long id, String statusEsperado, String novoStatus) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        PedidoCompra pedido = pedidoCompraRepository.findByIdAndEmpresaId(id, empresa.getId())
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado."));

        if (!pedido.getStatus().equals(statusEsperado)) {
            throw new RuntimeException("Status inválido para esta operação.");
        }
        pedido.setStatus(novoStatus);
        pedidoCompraRepository.save(pedido);
    }

    @Transactional
    public void confirmarRecebimento(Long pedidoId) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        PedidoCompra pedido = pedidoCompraRepository.findByIdAndEmpresaId(pedidoId, empresa.getId())
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado."));

        if (!"APROVADO".equals(pedido.getStatus())) {
            throw new RuntimeException("Apenas pedidos APROVADOS podem ser recebidos.");
        }

        Componente componenteFinal;

        // 1. Se o item JÁ EXISTE, atualiza o estoque
        if (pedido.getComponenteExistente() != null) {
            componenteFinal = pedido.getComponenteExistente();
            componenteFinal.setQuantidade(componenteFinal.getQuantidade() + pedido.getQuantidade());
            componenteRepository.save(componenteFinal);
        }
        // 2. Se é ITEM NOVO, cria o componente automaticamente
        else {
            Componente novoComp = new Componente();
            novoComp.setNome(pedido.getNomeItem());
            novoComp.setQuantidade(pedido.getQuantidade());
            novoComp.setEmpresa(empresa);
            novoComp.setLocalizacao("Almoxarifado (Recebimento)"); // Local provisório
            novoComp.setCategoria("Geral");
            novoComp.setNivelMinimoEstoque(5);

            String codigoGerado = empresa.getDominio().toUpperCase() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            novoComp.setCodigoPatrimonio(codigoGerado);

            componenteFinal = componenteRepository.save(novoComp);
        }

        // 3. IMPORTANTE: Gerar Histórico de Entrada!
        // Sem isso, o gráfico de movimentação não mostra que entrou coisa nova.
        criarRegistroHistorico(componenteFinal, pedido.getQuantidade(), empresa, pedido.getSolicitante().getEmail());

        pedido.setStatus("RECEBIDO");
        pedidoCompraRepository.save(pedido);
    }

    private void criarRegistroHistorico(Componente comp, int qtd, Empresa emp, String usuarioOrigem) {
        Historico h = new Historico();
        h.setComponente(comp);
        h.setTipo(TipoMovimentacao.ENTRADA); // Compra é entrada
        h.setQuantidade(qtd);
        h.setUsuario(usuarioOrigem); // Ou o usuário que recebeu (Admin logado)
        h.setDataHora(LocalDateTime.now());
        h.setCodigoMovimentacao(UUID.randomUUID().toString());
        h.setEmpresa(emp);
        historicoRepository.save(h);
    }

    // Conversores DTO (Mantidos iguais ao seu código, que já estava bom)
    private MeusPedidosCompraDTO toMeusPedidosDTO(PedidoCompra p) {
        return new MeusPedidosCompraDTO(p.getId(), p.getNomeItem(), p.getQuantidade(), p.getDataPedido(), p.getStatus());
    }

    private RequisicaoDTO toAprovacaoDTO(PedidoCompra p) {
        String email = p.getSolicitante() != null ? p.getSolicitante().getEmail() : "Sistema";
        return new RequisicaoDTO(p.getId(), p.getNomeItem(), p.getQuantidade(), p.getJustificativa(), email, p.getDataPedido());
    }
}