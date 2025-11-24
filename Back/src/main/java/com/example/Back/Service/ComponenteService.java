package com.example.Back.Service;

import com.example.Back.Dto.ComponenteDTO;
import com.example.Back.Entity.Componente;
import com.example.Back.Entity.Empresa;
import com.example.Back.Entity.Historico;
import com.example.Back.Entity.TipoMovimentacao;
import com.example.Back.Repository.ComponenteRepository;
import com.example.Back.Repository.HistoricoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ComponenteService {

    private final ComponenteRepository componenteRepository;
    private final HistoricoRepository historicoRepository;
    private final UsuarioService usuarioService;

    public ComponenteService(ComponenteRepository componenteRepository, HistoricoRepository historicoRepository, UsuarioService usuarioService) {
        this.componenteRepository = componenteRepository;
        this.historicoRepository = historicoRepository;
        this.usuarioService = usuarioService;
    }

    // --- CORREÇÃO: Usando Page em vez de List ---
    @Transactional(readOnly = true)
    public Page<ComponenteDTO> findAll(String termoDeBusca, Pageable pageable) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();

        Page<Componente> page;

        if (termoDeBusca == null || termoDeBusca.trim().isEmpty()) {
            page = componenteRepository.findAllByEmpresaId(empresa.getId(), pageable);
        } else {
            page = componenteRepository.searchByTermoAndEmpresaId(termoDeBusca, empresa.getId(), pageable);
        }

        // Converte a Page<Entity> para Page<DTO> mantendo a paginação
        return page.map(this::toDTO);
    }

    @Transactional
    public ComponenteDTO create(ComponenteDTO dto) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();

        // Regra de Negócio: Se vier código no DTO, usa ele. Se não, gera automático.
        String codigoFinal = dto.getCodigoPatrimonio();
        if (codigoFinal == null || codigoFinal.trim().isEmpty()) {
            codigoFinal = empresa.getDominio().toUpperCase() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }

        // Validação de Unicidade
        if (componenteRepository.existsByCodigoPatrimonioAndEmpresaId(codigoFinal, empresa.getId())) {
            throw new IllegalArgumentException("Já existe um componente com este código na sua empresa.");
        }

        Componente componente = toEntity(dto);
        componente.setCodigoPatrimonio(codigoFinal);
        componente.setEmpresa(empresa);

        Componente componenteSalvo = componenteRepository.save(componente);

        // Histórico de Entrada Inicial
        if (componenteSalvo.getQuantidade() > 0) {
            criarRegistroHistorico(componenteSalvo, TipoMovimentacao.ENTRADA, componenteSalvo.getQuantidade(), empresa);
        }

        return toDTO(componenteSalvo);
    }

    @Transactional
    public ComponenteDTO update(Long id, ComponenteDTO dto) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();

        Componente componenteExistente = componenteRepository.findByIdAndEmpresaId(id, empresa.getId())
                .orElseThrow(() -> new RuntimeException("Componente não encontrado."));

        int quantidadeAntiga = componenteExistente.getQuantidade();

        componenteExistente.setNome(dto.getNome());
        componenteExistente.setQuantidade(dto.getQuantidade());
        componenteExistente.setLocalizacao(dto.getLocalizacao());
        componenteExistente.setCategoria(dto.getCategoria());
        componenteExistente.setNivelMinimoEstoque(dto.getNivelMinimoEstoque());

        // Não atualizamos o código de patrimônio e nem a empresa por segurança

        Componente atualizado = componenteRepository.save(componenteExistente);

        // Gera histórico se houve mudança de quantidade manual
        int diferenca = atualizado.getQuantidade() - quantidadeAntiga;
        if (diferenca != 0) {
            criarRegistroHistorico(atualizado, diferenca > 0 ? TipoMovimentacao.ENTRADA : TipoMovimentacao.SAIDA, Math.abs(diferenca), empresa);
        }

        return toDTO(atualizado);
    }

    @Transactional
    public void delete(Long id) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();

        // Validação rápida antes de carregar o objeto inteiro
        if (!componenteRepository.existsByIdAndEmpresaId(id, empresa.getId())) {
            throw new RuntimeException("Componente não encontrado.");
        }

        // Apaga históricos antes para não dar erro de FK (Foreign Key)
        historicoRepository.deleteAllByComponenteIdAndEmpresaId(id, empresa.getId());

        // Deleta usando Query direta pelo ID e Empresa (mais seguro)
        // Nota: O JPA padrão não tem deleteByIdAndEmpresaId, então carregamos para garantir
        Componente c = componenteRepository.findByIdAndEmpresaId(id, empresa.getId()).get();
        componenteRepository.delete(c);
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

    private ComponenteDTO toDTO(Componente c) {
        return new ComponenteDTO(c.getId(), c.getNome(), c.getCodigoPatrimonio(), c.getQuantidade(), c.getLocalizacao(), c.getCategoria(), c.getNivelMinimoEstoque());
    }

    private Componente toEntity(ComponenteDTO d) {
        Componente c = new Componente();
        c.setNome(d.getNome());
        c.setQuantidade(d.getQuantidade());
        c.setLocalizacao(d.getLocalizacao());
        c.setCategoria(d.getCategoria());
        c.setNivelMinimoEstoque(d.getNivelMinimoEstoque());
        return c;
    }
}