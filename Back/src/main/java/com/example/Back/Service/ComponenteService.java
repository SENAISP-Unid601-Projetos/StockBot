package com.example.Back.Service;

import com.example.Back.Dto.ComponenteDTO;
import com.example.Back.Entity.Componente;
import com.example.Back.Entity.Historico;
import com.example.Back.Entity.TipoMovimentacao;
import com.example.Back.Repository.ComponenteRepository;
import com.example.Back.Repository.HistoricoRepository;
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

    // MELHORIA: Injeção de dependências via construtor
    public ComponenteService(ComponenteRepository componenteRepository, HistoricoRepository historicoRepository) {
        this.componenteRepository = componenteRepository;
        this.historicoRepository = historicoRepository;
    }

    // Retorna uma lista de DTOs, não de Entidades
    @Transactional(readOnly = true)
    public List<ComponenteDTO> findAll() {
        return componenteRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // MELHORIA: Método separado apenas para CRIAR
    @Transactional
    public ComponenteDTO create(ComponenteDTO dto) {
        // Validação para impedir patrimônio duplicado
        if (componenteRepository.existsByCodigoPatrimonio(dto.getCodigoPatrimonio())) {
            throw new IllegalArgumentException("Código de património já está em uso.");
        }

        Componente componente = toEntity(dto);
        Componente componenteSalvo = componenteRepository.save(componente);
        criarRegistroHistorico(componenteSalvo, TipoMovimentacao.ENTRADA, componenteSalvo.getQuantidade());
        return toDTO(componenteSalvo);
    }

    // MELHORIA: Método separado apenas para ATUALIZAR
    @Transactional
    public ComponenteDTO update(Long id, ComponenteDTO dto) {
        Componente componenteExistente = componenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Componente não encontrado com o id: " + id));

        int quantidadeAntiga = componenteExistente.getQuantidade();

        // Atualiza a entidade com os dados do DTO
        componenteExistente.setNome(dto.getNome());
        componenteExistente.setCodigoPatrimonio(dto.getCodigoPatrimonio());
        componenteExistente.setQuantidade(dto.getQuantidade());
        componenteExistente.setLocalizacao(dto.getLocalizacao());
        componenteExistente.setCategoria(dto.getCategoria());
        componenteExistente.setObservacoes(dto.getObservacoes());

        Componente componenteAtualizado = componenteRepository.save(componenteExistente);
        int quantidadeNova = componenteAtualizado.getQuantidade();
        int diferenca = quantidadeNova - quantidadeAntiga;

        if (diferenca > 0) {
            criarRegistroHistorico(componenteAtualizado, TipoMovimentacao.ENTRADA, diferenca);
        } else if (diferenca < 0) {
            criarRegistroHistorico(componenteAtualizado, TipoMovimentacao.SAIDA, Math.abs(diferenca));
        }

        return toDTO(componenteAtualizado);
    }

    // MELHORIA: Lida com o histórico antes de apagar
    @Transactional
    public void delete(Long id) {
        Componente componente = componenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Componente não encontrado com o id: " + id));

        // Apaga o histórico associado primeiro
        List<Historico> historicos = historicoRepository.findByComponenteId(id);
        historicoRepository.deleteAll(historicos);

        // Depois apaga o componente
        componenteRepository.delete(componente);
    }

    // Função privada para criar histórico (perfeita como estava)
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

    // Funções auxiliares para converter entre Entidade e DTO
    private ComponenteDTO toDTO(Componente componente) {
        return new ComponenteDTO(
                componente.getId(),
                componente.getNome(),
                componente.getCodigoPatrimonio(),
                componente.getQuantidade(),
                componente.getLocalizacao(),
                componente.getCategoria(),
                componente.getObservacoes()
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
        return componente;
    }
}
