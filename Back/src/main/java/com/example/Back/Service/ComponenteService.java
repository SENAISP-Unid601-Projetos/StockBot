package com.example.Back.Service;

import com.example.Back.Dto.*;
import com.example.Back.Entity.*;
import com.example.Back.Repository.*;
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
    private final UsuarioService usuarioService;

    public ComponenteService(ComponenteRepository componenteRepository, HistoricoRepository historicoRepository, RequisicaoService requisicaoService, UsuarioService usuarioService) {
        this.componenteRepository = componenteRepository;
        this.historicoRepository = historicoRepository;
        this.requisicaoService = requisicaoService;
        this.usuarioService = usuarioService;
    }

    @Transactional(readOnly = true)
    public List<ComponenteDTO> findAll(String termoDeBusca) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        List<Componente> componentes;

        if (termoDeBusca == null || termoDeBusca.trim().isEmpty()) {
            componentes = componenteRepository.findAllByEmpresaId(empresa.getId());
        } else {
            componentes = componenteRepository.searchByTermoAndEmpresaId(termoDeBusca, empresa.getId());
        }

        return componentes.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComponenteDTO create(ComponenteDTO dto) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();

        // Converte DTO para Entity (sem definir o código ainda)
        Componente componente = toEntity(dto);
        componente.setEmpresa(empresa);

        // --- GERAÇÃO AUTOMÁTICA DO CÓDIGO ---
        // Formato: DOMINIO-HASH (ex: TESTE-A1B2C3D4)
        String codigoGerado = empresa.getDominio().toUpperCase() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        componente.setCodigoPatrimonio(codigoGerado);
        // ------------------------------------

        Componente componenteSalvo = componenteRepository.save(componente);

        criarRegistroHistorico(componenteSalvo, TipoMovimentacao.ENTRADA, componenteSalvo.getQuantidade(), empresa);

        return toDTO(componenteSalvo);
    }

    @Transactional
    public ComponenteDTO update(Long id, ComponenteDTO dto) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();

        Componente componenteExistente = componenteRepository.findByIdAndEmpresaId(id, empresa.getId())
                .orElseThrow(() -> new RuntimeException("Componente não encontrado ou não pertence a esta empresa: " + id));

        int quantidadeAntiga = componenteExistente.getQuantidade();

        // --- CORREÇÃO: Atualizamos TUDO, MENOS o Código de Patrimônio ---
        componenteExistente.setNome(dto.getNome());
        // componenteExistente.setCodigoPatrimonio(...) <--- ESTA LINHA FOI REMOVIDA
        componenteExistente.setQuantidade(dto.getQuantidade());
        componenteExistente.setLocalizacao(dto.getLocalizacao());
        componenteExistente.setCategoria(dto.getCategoria());
        // ---------------------------------------------------------------

        Componente componenteAtualizado = componenteRepository.save(componenteExistente);

        // Lógica de histórico
        int quantidadeNova = componenteAtualizado.getQuantidade();
        int diferenca = quantidadeNova - quantidadeAntiga;

        if (diferenca != 0) {
            criarRegistroHistorico(componenteAtualizado, diferenca > 0 ? TipoMovimentacao.ENTRADA : TipoMovimentacao.SAIDA, Math.abs(diferenca), empresa);
        }

        return toDTO(componenteAtualizado);
    }

    @Transactional
    public void delete(Long id) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        Componente componente = componenteRepository.findByIdAndEmpresaId(id, empresa.getId())
                .orElseThrow(() -> new RuntimeException("Componente não encontrado ou não pertence a esta empresa: " + id));

        historicoRepository.deleteAllByComponenteIdAndEmpresaId(id, empresa.getId());
        componenteRepository.delete(componente);
    }

    @Transactional
    public void registrarPerda(Long id, int quantidadePerdida) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        Componente componente = componenteRepository.findByIdAndEmpresaId(id, empresa.getId())
                .orElseThrow(() -> new RuntimeException("Componente não encontrado ou não pertence a esta empresa: " + id));

        int novaQuantidade = componente.getQuantidade() - quantidadePerdida;
        componente.setQuantidade(Math.max(0, novaQuantidade));

        componenteRepository.save(componente);
        criarRegistroHistorico(componente, TipoMovimentacao.PERDA, quantidadePerdida, empresa);
    }

    private void criarRegistroHistorico(Componente componente, TipoMovimentacao tipo, int quantidade, Empresa empresa) {
        String emailUsuario = SecurityContextHolder.getContext().getAuthentication().getName();
        Historico historico = new Historico();
        historico.setComponente(componente);
        historico.setTipo(tipo);
        historico.setQuantidade(quantidade);
        historico.setUsuario(emailUsuario);
        historico.setDataHora(LocalDateTime.now());
        historico.setCodigoMovimentacao(UUID.randomUUID().toString());
        historico.setEmpresa(empresa);
        historicoRepository.save(historico);
    }

    private ComponenteDTO toDTO(Componente componente) {
        return new ComponenteDTO(
                componente.getId(),
                componente.getNome(),
                componente.getCodigoPatrimonio(),
                componente.getQuantidade(),
                componente.getLocalizacao(),
                componente.getCategoria()
        );
    }

    private Componente toEntity(ComponenteDTO dto) {
        Componente componente = new Componente();
        componente.setNome(dto.getNome());
        // O código de patrimônio não é definido aqui para não sobrescrever a geração automática com null
        componente.setQuantidade(dto.getQuantidade());
        componente.setLocalizacao(dto.getLocalizacao());
        componente.setCategoria(dto.getCategoria());
        return componente;
    }
}