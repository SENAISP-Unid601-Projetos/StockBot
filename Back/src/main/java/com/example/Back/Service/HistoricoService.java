package com.example.Back.Service;

import com.example.Back.Dto.HistoricoDTO;
import com.example.Back.Entity.Historico;
import com.example.Back.Repository.HistoricoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HistoricoService {

    private final HistoricoRepository historicoRepository;

    public HistoricoService(HistoricoRepository historicoRepository) {
        this.historicoRepository = historicoRepository;
    }

    @Transactional(readOnly = true)
    public Page<HistoricoDTO> findAllPaginated(Pageable pageable) {
        // O repositório já sabe como lidar com 'Pageable' se ele estender JpaRepository
        Page<Historico> historicoPage = historicoRepository.findAll(pageable);

        // Mapeia a página de Entidades para uma página de DTOs
        return historicoPage.map(this::toDTO);
    }

    // Método privado para converter a Entidade para o DTO que o frontend espera
    private HistoricoDTO toDTO(Historico historico) {
        String componenteNome = (historico.getComponente() != null)
                ? historico.getComponente().getNome()
                : "Componente Removido";

        return new HistoricoDTO(
                historico.getId(),
                historico.getComponente() != null ? historico.getComponente().getId() : null,
                componenteNome,
                historico.getTipo(),
                historico.getQuantidade(),
                historico.getUsuario(),
                historico.getDataHora(),
                historico.getCodigoMovimentacao()
        );
    }
}