// src/main/java/com/example/Back/Repository/MovimentacaoRepository.java
package com.example.Back.Repository;

import com.example.Back.Entity.Movimentacao;
import com.example.Back.Entity.Movimentacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {
}