package com.example.Back.Service;

import com.example.Back.Dto.HistoricoDTO;
import com.example.Back.Entity.Empresa; // <-- Importar Empresa
import com.example.Back.Entity.Historico;
import com.example.Back.Repository.HistoricoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HistoricoService {

    private final HistoricoRepository historicoRepository;
    private final UsuarioService usuarioService; // <-- Injetar UsuarioService

    public HistoricoService(HistoricoRepository historicoRepository, UsuarioService usuarioService) { // <-- Mudar construtor
        this.historicoRepository = historicoRepository;
        this.usuarioService = usuarioService; // <-- Atribuir UsuarioService
    }

    // CORRIGIDO: Filtra por empresa
    @Transactional(readOnly = true)
    public Page<HistoricoDTO> findAllPaginated(Pageable pageable) {
        // Pega a empresa do usuário logado
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();

        // Busca a página de histórico filtrada pelo ID da empresa
        Page<Historico> historicoPage = historicoRepository.findAllByEmpresaId(empresa.getId(), pageable);

        return historicoPage.map(this::toDTO);
    }

    // Método toDTO permanece o mesmo
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