package com.example.Back.Service;

import com.example.Back.Dto.ComponenteDTO;
import com.example.Back.Entity.Componente;
import com.example.Back.Entity.Historico;
import com.example.Back.Entity.TipoMovimentacao;
import com.example.Back.Entity.Usuario;
import com.example.Back.Repository.ComponenteRepository;
import com.example.Back.Repository.HistoricoRepository;
import com.example.Back.Repository.UsuarioRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ComponenteService {

    private final ComponenteRepository componenteRepository;
    private final HistoricoRepository historicoRepository;
    private final RequisicaoService requisicaoService;
    private final UsuarioRepository usuarioRepository; // NOVO: Injeção do repositório de usuário

    public ComponenteService(ComponenteRepository componenteRepository, HistoricoRepository historicoRepository, RequisicaoService requisicaoService, UsuarioRepository usuarioRepository) {
        this.componenteRepository = componenteRepository;
        this.historicoRepository = historicoRepository;
        this.requisicaoService = requisicaoService;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<ComponenteDTO> findAll(String termoDeBusca) {
        List<Componente> componentes;
        if (termoDeBusca == null || termoDeBusca.trim().isEmpty()) {
            componentes = componenteRepository.findAll();
        } else {
            componentes = componenteRepository.searchByTermo(termoDeBusca);
        }
        return componentes.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComponenteDTO create(ComponenteDTO dto) {
        // REMOVIDO: A validação de unicidade do código de patrimônio.
        // O código agora é gerado automaticamente, então não há necessidade de verificar se já existe.

        // OBTEM o domínio do utilizador logado para a geração do código
        String usuarioEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(usuarioEmail)
                .orElseThrow(() -> new RuntimeException("Utilizador autenticado não encontrado."));
        String dominioEmpresa = usuario.getDominioEmpresa();

        Componente componente = toEntity(dto);

        // NOVO: Geração automática do código de patrimônio
        componente.setCodigoPatrimonio(dominioEmpresa + "-" + UUID.randomUUID().toString());

        Componente componenteSalvo = componenteRepository.save(componente);
        criarRegistroHistorico(componenteSalvo, TipoMovimentacao.ENTRADA, componenteSalvo.getQuantidade());

        if (componenteSalvo.getQuantidade() <= componenteSalvo.getNivelMinimoEstoque()) {
            requisicaoService.criarRequisicaoParaItem(componenteSalvo);
        }

        return toDTO(componenteSalvo);
    }

    @Transactional
    public ComponenteDTO update(Long id, ComponenteDTO dto) {
        Componente componenteExistente = componenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Componente não encontrado com o id: " + id));

        int quantidadeAntiga = componenteExistente.getQuantidade();

        componenteExistente.setNome(dto.getNome());
        componenteExistente.setCodigoPatrimonio(dto.getCodigoPatrimonio());
        componenteExistente.setQuantidade(dto.getQuantidade());
        componenteExistente.setLocalizacao(dto.getLocalizacao());
        componenteExistente.setCategoria(dto.getCategoria());
        componenteExistente.setObservacoes(dto.getObservacoes());
        componenteExistente.setNivelMinimoEstoque(dto.getNivelMinimoEstoque());

        Componente componenteAtualizado = componenteRepository.save(componenteExistente);
        int quantidadeNova = componenteAtualizado.getQuantidade();
        int diferenca = quantidadeNova - quantidadeAntiga;

        if (diferenca != 0) {
            criarRegistroHistorico(componenteAtualizado, diferenca > 0 ? TipoMovimentacao.ENTRADA : TipoMovimentacao.SAIDA, Math.abs(diferenca));
        }

        if (componenteAtualizado.getQuantidade() <= componenteAtualizado.getNivelMinimoEstoque()) {
            requisicaoService.criarRequisicaoParaItem(componenteAtualizado);
        }

        return toDTO(componenteAtualizado);
    }

    @Transactional
    public void delete(Long id) {
        Componente componente = componenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Componente não encontrado com o id: " + id));

        List<Historico> historicos = historicoRepository.findByComponenteId(id);
        historicoRepository.deleteAll(historicos);

        componenteRepository.delete(componente);
    }

    @Transactional
    public void registrarPerda(Long id, int quantidadePerdida) {
        Componente componente = componenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Componente não encontrado com o id: " + id));

        int novaQuantidade = componente.getQuantidade() - quantidadePerdida;
        componente.setQuantidade(Math.max(0, novaQuantidade)); // Evita estoque negativo

        componenteRepository.save(componente);

        criarRegistroHistorico(componente, TipoMovimentacao.PERDA, quantidadePerdida);
    }

    private void criarRegistroHistorico(Componente componente, TipoMovimentacao tipo, int quantidade) {
        String emailUsuario = SecurityContextHolder.getContext().getAuthentication().getName();
        Historico historico = new Historico();
        historico.setComponente(componente);
        historico.setTipo(tipo);
        historico.setQuantidade(quantidade);
        historico.setUsuario(emailUsuario);
        historico.setDataHora(LocalDateTime.now());
        historico.setCodigoMovimentacao(UUID.randomUUID().toString());
        historicoRepository.save(historico);
    }

    private ComponenteDTO toDTO(Componente componente) {
        return new ComponenteDTO(
                componente.getId(),
                componente.getNome(),
                componente.getCodigoPatrimonio(),
                componente.getQuantidade(),
                componente.getLocalizacao(),
                componente.getCategoria(),
                componente.getObservacoes(),
                componente.getNivelMinimoEstoque()
        );
    }

    private Componente toEntity(ComponenteDTO dto) {
        Componente componente = new Componente();
        componente.setNome(dto.getNome());
        componente.setCodigoPatrimonio(dto.getCodigoPatrimonio());
        componente.setQuantidade(dto.getQuantidade());
        componente.setLocalizacao(dto.getLocalizacao());
        componente.setCategoria(dto.getCategoria());
        componente.setObservacoes(dto.getObservacoes());
        componente.setNivelMinimoEstoque(dto.getNivelMinimoEstoque());
        return componente;
    }
}