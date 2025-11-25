package com.example.Back.Service;

import com.example.Back.Dto.RequisicaoDTO;
import com.example.Back.Entity.Empresa;
import com.example.Back.Entity.Requisicao;
import com.example.Back.Repository.RequisicaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequisicaoService {

    private final RequisicaoRepository requisicaoRepository;
    private final UsuarioService usuarioService;

    public RequisicaoService(RequisicaoRepository requisicaoRepository, UsuarioService usuarioService) {
        this.requisicaoRepository = requisicaoRepository;
        this.usuarioService = usuarioService;
    }

    @Transactional(readOnly = true)
    public List<RequisicaoDTO> findPendentesByEmpresa() {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();

        // O repositório já faz o JOIN, então o getComponente().getNome() não vai no banco de novo
        List<Requisicao> requisicoes = requisicaoRepository
                .findAllByEmpresaIdAndStatusOrderByDataRequisicaoDesc(empresa.getId(), "PENDENTE");

        return requisicoes.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void concluirRequisicaoByEmpresa(Long id) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();

        Requisicao requisicao = requisicaoRepository.findByIdAndEmpresaId(id, empresa.getId())
                .orElseThrow(() -> new RuntimeException("Requisição não encontrada ou não pertence a esta empresa."));

        // Ex: componenteService.registrarSaida(requisicao.getComponente().getId(), requisicao.getQuantidade());

        requisicao.setStatus("CONCLUIDO");
        requisicaoRepository.save(requisicao);
    }

    // Converter Entidade -> DTO
    private RequisicaoDTO toDTO(Requisicao req) {
        String nomeComponente = (req.getComponente() != null)
                ? req.getComponente().getNome()
                : "Componente Removido";

        String emailSolicitante = (req.getSolicitante() != null)
                ? req.getSolicitante().getEmail()
                : "Sistema Automático";

        return new RequisicaoDTO(
                req.getId(),
                nomeComponente,
                req.getQuantidade(),
                req.getJustificativa(),
                emailSolicitante,
                req.getDataRequisicao()
        );
    }
}