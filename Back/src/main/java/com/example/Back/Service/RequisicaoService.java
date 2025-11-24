package com.example.Back.Service;

import com.example.Back.Entity.Componente;
import com.example.Back.Entity.Empresa;
import com.example.Back.Entity.Requisicao;
import com.example.Back.Dto.RequisicaoDTO;
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

        List<Requisicao> requisicoes = requisicaoRepository.findAllByEmpresaIdAndStatus(empresa.getId(), "PENDENTE");

        return requisicoes.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void concluirRequisicaoByEmpresa(Long id) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();

        Requisicao requisicao = requisicaoRepository.findByIdAndEmpresaId(id, empresa.getId())
                .orElseThrow(() -> new RuntimeException("Requisição não encontrada ou não pertence a esta empresa."));

        requisicao.setStatus("CONCLUIDO");
        requisicaoRepository.save(requisicao);
    }

    private RequisicaoDTO toDTO(Requisicao req) {
        String componenteNome = (req.getComponente() != null)
                ? req.getComponente().getNome()
                : "Componente não encontrado";

        String solicitanteEmail = (req.getSolicitante() != null)
                ? req.getSolicitante().getEmail()
                : "Sistema";

        return new RequisicaoDTO(
                req.getId(),
                componenteNome,
                req.getQuantidade(),
                req.getJustificativa(),
                solicitanteEmail,
                req.getDataRequisicao()
        );
    }
}
