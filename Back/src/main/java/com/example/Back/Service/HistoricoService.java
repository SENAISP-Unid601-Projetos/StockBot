package com.example.Back.Service;

import com.example.Back.Dto.HistoricoDTO;
import com.example.Back.Entity.Empresa;
import com.example.Back.Entity.Historico;
import com.example.Back.Repository.HistoricoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HistoricoService {

    private final HistoricoRepository historicoRepository;
    private final UsuarioService usuarioService;

    public HistoricoService(HistoricoRepository historicoRepository, UsuarioService usuarioService) {
        this.historicoRepository = historicoRepository;
        this.usuarioService = usuarioService;
    }

    @Transactional(readOnly = true)
    public Page<HistoricoDTO> findAllPaginated(Pageable pageable) {
        // 1. Segurança: Garante que só busca dados da empresa do token
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();

        // 2. Busca Otimizada (Repository já faz o JOIN com Componente)
        Page<Historico> historicoPage = historicoRepository.findAllByEmpresaId(empresa.getId(), pageable);

        // 3. Converte para DTO
        return historicoPage.map(this::toDTO);
    }

    private HistoricoDTO toDTO(Historico historico) {
        // Tratamento de segurança caso o componente venha nulo (soft delete ou erro de base)
        String nomeComponente = "Desconhecido";
        Long componenteId = null;

        if (historico.getComponente() != null) {
            nomeComponente = historico.getComponente().getNome();
            componenteId = historico.getComponente().getId();
        }

        return new HistoricoDTO(
                historico.getId(),
                componenteId,
                nomeComponente,
                historico.getTipo(),
                historico.getQuantidade(),
                historico.getUsuario(),
                historico.getDataHora(),
                historico.getCodigoMovimentacao()
        );
    }
}