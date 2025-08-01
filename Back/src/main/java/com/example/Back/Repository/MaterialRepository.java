// src/main/java/com/example/Back/Repository/MaterialRepository.java
package com.example.Back.Repository;

import com.example.Back.Entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    boolean existsByCodigo(String codigo);
    Material findByCodigo(String codigo);
}