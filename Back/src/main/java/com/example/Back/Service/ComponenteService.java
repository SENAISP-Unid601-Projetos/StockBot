package com.example.Back.Service;

import com.example.Back.Dto.ComponenteDTO;
import com.example.Back.Entity.Componente;
import com.example.Back.Entity.Historico;
import com.example.Back.Entity.TipoMovimentacao;
import com.example.Back.Repository.ComponenteRepository;
import com.example.Back.Repository.HistoricoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ComponenteService {

    @Autowired
    private ComponenteRepository componenteRepository;

    @Autowired
    private HistoricoRepository historicoRepository;

    // Nome correto: findAll() | Retorno correto: List<ComponenteDTO>
    @Transactional(readOnly = true)
    public List<ComponenteDTO> findAll() {
        List<Componente> componentes = componenteRepository.findAll();
        // Converte a lista de Entidades para uma lista de DTOs
        return componentes.stream()
                .map(ComponenteDTO::new)
                .collect(Collectors.toList());
    }

    // Nome correto: create() | Parâmetro correto: ComponenteDTO
    @Transactional
    public ComponenteDTO create(ComponenteDTO dto) {
        // Converte o DTO recebido para uma Entidade
        Componente componente = new Componente();
        componente.setNome(dto.getNome());
        componente.setCodigoPatrimonio(dto.getCodigoPatrimonio());
        componente.setQuantidade(dto.getQuantidade());
        componente.setLocalizacao(dto.getLocalizacao());
        componente.setCategoria(dto.getCategoria());
        componente.setObservacoes(dto.getObservacoes());

        Componente componenteSalvo = componenteRepository.save(componente);

        // Mantém a sua lógica de criar histórico para novos itens
        criarRegistroHistorico(componenteSalvo, TipoMovimentacao.ENTRADA, componenteSalvo.getQuantidade());

        // Retorna um DTO do objeto salvo
        return new ComponenteDTO(componenteSalvo);
    }

    // Nome correto: update() | Parâmetros corretos: Long id, ComponenteDTO
    @Transactional
    public ComponenteDTO update(Long id, ComponenteDTO dto) {
        Componente componenteExistente = componenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Componente não encontrado"));

        int quantidadeAntiga = componenteExistente.getQuantidade();

        // Atualiza a Entidade com os dados do DTO
        componenteExistente.setNome(dto.getNome());
        componenteExistente.setCodigoPatrimonio(dto.getCodigoPatrimonio());
        componenteExistente.setQuantidade(dto.getQuantidade());
        componenteExistente.setLocalizacao(dto.getLocalizacao());
        componenteExistente.setCategoria(dto.getCategoria());
        componenteExistente.setObservacoes(dto.getObservacoes());

        Componente componenteSalvo = componenteRepository.save(componenteExistente);

        // Mantém a sua lógica de criar histórico para atualizações
        int quantidadeNova = componenteSalvo.getQuantidade();
        int diferenca = quantidadeNova - quantidadeAntiga;

        if (diferenca > 0) {
            criarRegistroHistorico(componenteSalvo, TipoMovimentacao.ENTRADA, diferenca);
        } else if (diferenca < 0) {
            criarRegistroHistorico(componenteSalvo, TipoMovimentacao.SAIDA, Math.abs(diferenca));
        }

        return new ComponenteDTO(componenteSalvo);
    }

    // Nome correto: delete()
    @Transactional
    public void delete(Long id) {
        if (!componenteRepository.existsById(id)) {
            throw new RuntimeException("Componente não encontrado com o id: " + id);
        }
        componenteRepository.deleteById(id);
    }

    // A sua função de histórico permanece intacta
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
}
