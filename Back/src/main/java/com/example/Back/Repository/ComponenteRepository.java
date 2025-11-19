package com.example.Back.Repository;

import com.example.Back.Entity.Componente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComponenteRepository extends JpaRepository<Componente, Long> {
    boolean existsByCodigoPatrimonio(String codigoPatrimonio);
    Optional<Componente> findByCodigoPatrimonio(String codigoPatrimonio);

    // MÉTODO NOVO PARA A PESQUISA
    // Procura o 'termo' no nome OU no código de património, ignorando maiúsculas/minúsculas
    @Query("SELECT c FROM Componente c WHERE c.empresa.id = :empresaId AND (" +
            "LOWER(c.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "LOWER(c.codigoPatrimonio) LIKE LOWER(CONCAT('%', :termo, '%')))")
    List<Componente> searchByTermoAndEmpresaId(@Param("termo") String termo, @Param("empresaId") Long empresaId);

    // Adicione estes novos métodos:
    List<Componente> findAllByEmpresaId(Long empresaId);
    Optional<Componente> findByIdAndEmpresaId(Long id, Long empresaId);
    boolean existsByCodigoPatrimonioAndEmpresaId(String codigoPatrimonio, Long empresaId);
}
