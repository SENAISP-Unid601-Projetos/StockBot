package com.example.Back.Repository;

import com.example.Back.Entity.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // 1. OTIMIZAÇÃO DE LOGIN (Traz a empresa junto num select só)
    @EntityGraph(attributePaths = {"empresa"})
    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    // 2. PAGINAÇÃO (A pérola do seu fork)
    // Em vez de devolver List<Usuario> (pesado), devolvemos uma Page (leve).
    // O Spring faz automaticamente o "LIMIT 20 OFFSET 0" no SQL.
    Page<Usuario> findAllByEmpresaId(Long empresaId, Pageable pageable);

    // 3. SEGURANÇA (Multi-tenant)
    // Garante que o usuário existe E pertence à empresa solicitada
    Optional<Usuario> findByIdAndEmpresaId(Long id, Long empresaId);

    // 4. VALIDAÇÃO RÁPIDA (Economiza memória)
    // Verifica se existe sem trazer os dados do banco. Ótimo para usar antes de delete.
    boolean existsByIdAndEmpresaId(Long id, Long empresaId);
}