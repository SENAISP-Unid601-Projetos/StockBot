package com.example.Back.Service;

import com.example.Back.Entity.Componente;
import com.example.Back.Entity.Requisicao;
import com.example.Back.Repository.RequisicaoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RequisicaoService {

    private final RequisicaoRepository requisicaoRepository;

    public RequisicaoService(RequisicaoRepository requisicaoRepository) {
        this.requisicaoRepository = requisicaoRepository;
    }

    public void criarRequisicaoParaItem(Componente componente) {
        Requisicao novaRequisicao = new Requisicao();
        novaRequisicao.setComponente(componente);
        novaRequisicao.setDataRequisicao(LocalDateTime.now());
        novaRequisicao.setStatus("PENDENTE");
        requisicaoRepository.save(novaRequisicao);
    }
}

