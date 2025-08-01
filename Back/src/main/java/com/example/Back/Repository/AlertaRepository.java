// src/main/java/com/example/Back/Repository/AlertaRepository.java
package com.example.Back.Repository;

import com.example.Back.Entity.Alerta;
import com.example.Back.Entity.Alerta.AlertaStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {
    List<Alerta> findByStatus(AlertaStatus status);
    List<Alerta> findByStatusAndUsuarioResponsavelId(AlertaStatus status, Long usuarioId);
}