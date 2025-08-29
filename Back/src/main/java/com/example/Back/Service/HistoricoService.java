package com.example.Back.Service;

import com.example.Back.Dto.HistoricoDTO;
import com.example.Back.Entity.Historico;
import com.example.Back.Repository.ComponenteRepository;
import com.example.Back.Repository.HistoricoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HistoricoService {

    @Autowired
    private HistoricoRepository historicoRepository;

    @Autowired
    private ComponenteRepository componenteRepository;

    public List<HistoricoDTO> getAllHistorico() {
        return historicoRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<HistoricoDTO> getHistoricoById(Long id) {
        return historicoRepository.findById(id)
                .map(this::convertToDto);
    }

    @Transactional
    public HistoricoDTO createHistorico(HistoricoDTO historicoDto) {
        // Converte o DTO para a Entidade, buscando o Componente pelo ID
        Historico historico = convertToEntity(historicoDto);
        Historico novoHistorico = historicoRepository.save(historico);
        return convertToDto(novoHistorico);
    }

    @Transactional
    public Optional<HistoricoDTO> updateHistorico(Long id, HistoricoDTO historicoDetailsDto) {
        return historicoRepository.findById(id).map(historico -> {
            historico.setCodigoMovimentacao(historicoDetailsDto.getCodigoMovimentacao());
            historico.setDataHora(historicoDetailsDto.getDataHora());
            historico.setTipo(historicoDetailsDto.getTipo());
            historico.setQuantidade(historicoDetailsDto.getQuantidade());
            historico.setUsuario(historicoDetailsDto.getUsuario());

            // Se o ID do componente foi alterado, busca e atualiza o componente
            if (historicoDetailsDto.getComponenteId() != null) {
                componenteRepository.findById(historicoDetailsDto.getComponenteId())
                        .ifPresent(historico::setComponente);
            }

            Historico updatedHistorico = historicoRepository.save(historico);
            return convertToDto(updatedHistorico);
        });
    }

    public boolean deleteHistorico(Long id) {
        if (historicoRepository.existsById(id)) {
            historicoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // --- Métodos de Conversão ---

    private HistoricoDTO convertToDto(Historico historico) {
        HistoricoDTO dto = new HistoricoDTO();
        dto.setId(historico.getId());
        dto.setCodigoMovimentacao(historico.getCodigoMovimentacao());
        dto.setDataHora(historico.getDataHora());
        dto.setTipo(historico.getTipo());
        // Garante que o ID do componente seja definido no DTO
        if (historico.getComponente() != null) {
            dto.setComponenteId(historico.getComponente().getId());
        }
        dto.setQuantidade(historico.getQuantidade());
        dto.setUsuario(historico.getUsuario());
        return dto;
    }

    private Historico convertToEntity(HistoricoDTO dto) {
        Historico historico = new Historico();
        historico.setCodigoMovimentacao(dto.getCodigoMovimentacao());
        historico.setDataHora(dto.getDataHora());
        historico.setTipo(dto.getTipo());
        historico.setQuantidade(dto.getQuantidade());
        historico.setUsuario(dto.getUsuario());
        // Busca e associa o Componente pelo ID do DTO
        componenteRepository.findById(dto.getComponenteId())
                .ifPresent(historico::setComponente);
        return historico;
    }
}