// src/main/java/com/example/Back/Service/AlertaService.java
package com.example.Back.Service;

import com.example.Back.DTO.AlertaDTO;
import com.example.Back.DTO.ResolucaoAlertaDTO;
import com.example.Back.Entity.Alerta;
import com.example.Back.Entity.Alerta.AlertaStatus;
import com.example.Back.Entity.Usuario;
import com.example.Back.Mapper.AlertaMapper;
import com.example.Back.Repository.AlertaRepository;
import com.example.Back.Repository.UsuarioRepository;
import com.example.Back.config.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertaService {
    private final AlertaRepository alertaRepository;
    private final UsuarioRepository usuarioRepository;
    private final AlertaMapper alertaMapper;

    @Transactional(readOnly = true)
    public List<AlertaDTO> listarAlertasPendentes() {
        return alertaRepository.findByStatus(AlertaStatus.PENDENTE)
                .stream()
                .map(alertaMapper::toAlertaDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AlertaDTO> listarAlertasPendentesPorUsuario(Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new EntityNotFoundException("Usuário não encontrado");
        }

        return alertaRepository.findByStatusAndUsuarioResponsavelId(AlertaStatus.PENDENTE, usuarioId)
                .stream()
                .map(alertaMapper::toAlertaDTO)
                .collect(Collectors.toList());
    }
    @Transactional
    public AlertaDTO resolverAlerta(Long id, ResolucaoAlertaDTO resolucaoDTO, Long usuarioResolucaoId) {
        Alerta alerta = alertaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Alerta não encontrado"));

        if (alerta.getStatus() != AlertaStatus.PENDENTE) {
            throw new IllegalStateException("Alerta já foi resolvido ou arquivado");
        }

        Usuario usuarioResolucao = usuarioRepository.findById(usuarioResolucaoId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        alerta.setStatus(AlertaStatus.RESOLVIDO);
        alerta.setDataResolucao(LocalDateTime.now());
        alerta.setComentarioResolucao(resolucaoDTO.getComentarioResolucao());
        alerta.setUsuarioResolucao(usuarioResolucao);

        Alerta alertaResolvido = alertaRepository.save(alerta);
        return alertaMapper.toAlertaDTO(alertaResolvido);
    }

    @Transactional
    public AlertaDTO arquivarAlerta(Long id, Long usuarioId) {
        Alerta alerta = alertaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Alerta não encontrado"));

        if (alerta.getStatus() != AlertaStatus.RESOLVIDO) {
            throw new IllegalStateException("Apenas alertas resolvidos podem ser arquivados");
        }

        alerta.setStatus(AlertaStatus.ARQUIVADO);
        Alerta alertaArquivado = alertaRepository.save(alerta);
        return alertaMapper.toAlertaDTO(alertaArquivado);
    }
}