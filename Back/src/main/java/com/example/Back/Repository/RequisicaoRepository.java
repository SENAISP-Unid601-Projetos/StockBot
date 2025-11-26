package com.example.Back.Repository;

import com.example.Back.Entity.Requisicao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // Adicionar import
import java.util.Optional; // Adicionar import

@Repository
public interface RequisicaoRepository extends JpaRepository<Requisicao, Long> {

    // Método para buscar requisições pendentes de uma empresa específica
    List<Requisicao> findAllByEmpresaIdAndStatus(Long empresaId, String status);

    // Método para buscar uma requisição específica de uma empresa
    Optional<Requisicao> findByIdAndEmpresaId(Long id, Long empresaId);
}