package com.example.Back.Service;

import com.example.Back.Entity.Componente;
import com.example.Back.Entity.Empresa; // <-- Importar
import com.example.Back.Entity.Requisicao;
import com.example.Back.Repository.RequisicaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- Importar

import java.time.LocalDateTime;
import java.util.List; // <-- Importar

@Service
public class RequisicaoService {

    private final RequisicaoRepository requisicaoRepository;
    private final UsuarioService usuarioService; // <-- Injetar UsuarioService

    // 1. Modificar Construtor
    public RequisicaoService(RequisicaoRepository requisicaoRepository, UsuarioService usuarioService) {
        this.requisicaoRepository = requisicaoRepository;
        this.usuarioService = usuarioService;
    }

    // 2. Modificar criarRequisicaoParaItem
    @Transactional
    public void criarRequisicaoParaItem(Componente componente) {
        // Pega a empresa do componente (que é a empresa do usuário)
        Empresa empresa = componente.getEmpresa();
        if (empresa == null) {
            // Fallback caso o componente não tenha empresa (embora não deva acontecer)
            empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        }

        Requisicao novaRequisicao = new Requisicao();
        novaRequisicao.setComponente(componente);
        novaRequisicao.setDataRequisicao(LocalDateTime.now());
        novaRequisicao.setStatus("PENDENTE");
        novaRequisicao.setEmpresa(empresa); // <-- Associar a empresa

        requisicaoRepository.save(novaRequisicao);
    }

    // 3. Adicionar método para buscar pendentes (para o frontend)
    @Transactional(readOnly = true)
    public List<Requisicao> findPendentesByEmpresa() {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        return requisicaoRepository.findAllByEmpresaIdAndStatus(empresa.getId(), "PENDENTE");
    }

    // 4. Adicionar método para concluir (para o frontend)
    @Transactional
    public void concluirRequisicaoByEmpresa(Long id) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();

        Requisicao requisicao = requisicaoRepository.findByIdAndEmpresaId(id, empresa.getId())
                .orElseThrow(() -> new RuntimeException("Requisição não encontrada ou não pertence a esta empresa."));

        requisicao.setStatus("CONCLUIDO");
        requisicaoRepository.save(requisicao);
    }
}