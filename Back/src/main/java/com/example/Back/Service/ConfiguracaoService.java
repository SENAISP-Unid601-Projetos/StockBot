package com.example.Back.Service;

import com.example.Back.DTO.ConfiguracaoCreateDTO;
import com.example.Back.DTO.ConfiguracaoResponseDTO;
import com.example.Back.DTO.ConfiguracaoUpdateDTO;
import com.example.Back.Entity.Configuracao;
import com.example.Back.Mapper.ConfiguracaoMapper;
import com.example.Back.Repository.ConfiguracaoRepository;
import com.example.Back.config.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConfiguracaoService {

    private final ConfiguracaoRepository repository;
    private final ConfiguracaoMapper mapper;

    public ConfiguracaoResponseDTO criarConfiguracao(ConfiguracaoCreateDTO dto) {
        if (repository.existsByChave(dto.getChave())) {
            throw new IllegalArgumentException("Chave de configuração já existe");
        }

        Configuracao entity = mapper.toEntity(dto);
        return mapper.toResponseDTO(repository.save(entity));
    }

    public ConfiguracaoResponseDTO buscarPorId(Long id) {
        Configuracao entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Configuração não encontrada"));
        return mapper.toResponseDTO(entity);
    }

    public ConfiguracaoResponseDTO buscarPorChave(String chave) {
        Configuracao entity = repository.findByChave(chave)
                .orElseThrow(() -> new EntityNotFoundException("Configuração não encontrada"));
        return mapper.toResponseDTO(entity);
    }

    public List<ConfiguracaoResponseDTO> listarTodas() {
        return repository.findAll().stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public ConfiguracaoResponseDTO atualizarConfiguracao(Long id, ConfiguracaoUpdateDTO dto) {
        Configuracao entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Configuração não encontrada"));

        mapper.updateFromUpdateDTO(dto, entity);
        return mapper.toResponseDTO(repository.save(entity));
    }

    public void deletarConfiguracao(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Configuração não encontrada");
        }
        repository.deleteById(id);
    }
}