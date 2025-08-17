package com.example.Back.Repository;


import com.example.Back.Entity.Componente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ComponenteRepository extends JpaRepository<Componente, Long> {
}
