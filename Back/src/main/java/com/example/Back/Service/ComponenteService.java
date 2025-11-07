package com.example.Back.Service;

import com.example.Back.Dto.ComponenteDTO;
import com.example.Back.Entity.Componente;
import com.example.Back.Entity.Empresa; // <-- Importar Empresa
import com.example.Back.Entity.Historico;
import com.example.Back.Entity.TipoMovimentacao;
import com.example.Back.Entity.Usuario;
import com.example.Back.Repository.ComponenteRepository;
import com.example.Back.Repository.HistoricoRepository;
// Removida a injeção do UsuarioRepository, usaremos o UsuarioService
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
    private final UsuarioService usuarioService; // <-- Injetar UsuarioService

    public ComponenteService(ComponenteRepository componenteRepository, HistoricoRepository historicoRepository, RequisicaoService requisicaoService, UsuarioService usuarioService) { // <-- Mudar construtor
        this.componenteRepository = componenteRepository;
        this.historicoRepository = historicoRepository;
        this.requisicaoService = requisicaoService;
        this.usuarioService = usuarioService; // <-- Atribuir UsuarioService
    }

    // CORRIGIDO: Filtra por empresa
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

    // CORRIGIDO: Associa empresa ao criar
    @Transactional
    public ComponenteDTO create(ComponenteDTO dto) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();

        // Verifica se o código de patrimônio já existe *nessa empresa*
        if (componenteRepository.existsByCodigoPatrimonioAndEmpresaId(dto.getCodigoPatrimonio(), empresa.getId())) {
            throw new IllegalArgumentException("Código de patrimônio já existe nesta empresa.");
        }

        Componente componente = toEntity(dto);
        componente.setEmpresa(empresa); // Associa a empresa

        // A geração automática do código (que discutimos) foi removida para manter a lógica original do DTO
        // Se quiser gerar automaticamente, descomente a linha abaixo e ajuste o toEntity
        // componente.setCodigoPatrimonio(empresa.getDominio() + "-" + UUID.randomUUID().toString().substring(0, 8));

        Componente componenteSalvo = componenteRepository.save(componente);

        // Passa a empresa para o método de histórico
        criarRegistroHistorico(componenteSalvo, TipoMovimentacao.ENTRADA, componenteSalvo.getQuantidade(), empresa);

        if (componenteSalvo.getQuantidade() <= componenteSalvo.getNivelMinimoEstoque()) {
            // requisicaoService.criarRequisicaoParaItem(componenteSalvo); // Este método também precisará da 'empresa'
            // Vamos deixar a lógica de requisição comentada por enquanto, até ajustarmos RequisicaoService
        }

        return toDTO(componenteSalvo);
    }

    // CORRIGIDO: Filtra por empresa
    @Transactional
    public ComponenteDTO update(Long id, ComponenteDTO dto) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();

        Componente componenteExistente = componenteRepository.findByIdAndEmpresaId(id, empresa.getId())
                .orElseThrow(() -> new RuntimeException("Componente não encontrado ou não pertence a esta empresa: " + id));

        // Verifica se o NOVO código de patrimônio já existe em OUTRO item desta empresa
        if (!componenteExistente.getCodigoPatrimonio().equals(dto.getCodigoPatrimonio()) &&
                componenteRepository.existsByCodigoPatrimonioAndEmpresaId(dto.getCodigoPatrimonio(), empresa.getId())) {
            throw new IllegalArgumentException("O novo código de patrimônio já está em uso por outro item nesta empresa.");
        }

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
            criarRegistroHistorico(componenteAtualizado, diferenca > 0 ? TipoMovimentacao.ENTRADA : TipoMovimentacao.SAIDA, Math.abs(diferenca), empresa);
        }

        // if (componenteAtualizado.getQuantidade() <= componenteAtualizado.getNivelMinimoEstoque()) {
        //     requisicaoService.criarRequisicaoParaItem(componenteAtualizado); // Também precisará da empresa
        // }

        return toDTO(componenteAtualizado);
    }

    // CORRIGIDO: Filtra por empresa
    @Transactional
    public void delete(Long id) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();

        Componente componente = componenteRepository.findByIdAndEmpresaId(id, empresa.getId())
                .orElseThrow(() -> new RuntimeException("Componente não encontrado ou não pertence a esta empresa: " + id));

        // Apaga o histórico deste componente NESTA empresa
        historicoRepository.deleteAllByComponenteIdAndEmpresaId(id, empresa.getId());

        // Apaga o componente
        componenteRepository.delete(componente);
    }

    // CORRIGIDO: Filtra por empresa
    @Transactional
    public void registrarPerda(Long id, int quantidadePerdida) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();

        Componente componente = componenteRepository.findByIdAndEmpresaId(id, empresa.getId())
                .orElseThrow(() -> new RuntimeException("Componente não encontrado ou não pertence a esta empresa: " + id));

        int novaQuantidade = componente.getQuantidade() - quantidadePerdida;
        componente.setQuantidade(Math.max(0, novaQuantidade)); // Evita estoque negativo

        componenteRepository.save(componente);

        criarRegistroHistorico(componente, TipoMovimentacao.PERDA, quantidadePerdida, empresa);
    }

    // CORRIGIDO: Recebe a Empresa e a associa ao Histórico
    private void criarRegistroHistorico(Componente componente, TipoMovimentacao tipo, int quantidade, Empresa empresa) {
        String emailUsuario = SecurityContextHolder.getContext().getAuthentication().getName();

        Historico historico = new Historico();
        historico.setComponente(componente);
        historico.setTipo(tipo);
        historico.setQuantidade(quantidade);
        historico.setUsuario(emailUsuario);
        historico.setDataHora(LocalDateTime.now());
        historico.setCodigoMovimentacao(UUID.randomUUID().toString());
        historico.setEmpresa(empresa); // <-- Associa a empresa ao histórico

        historicoRepository.save(historico);
    }

    // DTO e Entity (métodos toDTO e toEntity) permanecem iguais
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
        // Não definimos a empresa aqui, o serviço faz isso
        return componente;
    }
}