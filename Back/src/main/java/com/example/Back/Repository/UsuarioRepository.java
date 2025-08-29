package com.example.Back.Repository;

import com.example.Back.Entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional; // 1. Importe o Optional

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // 2. A MUDANÇA É AQUI: O método agora retorna um Optional<Usuario>
    Optional<Usuario> findByEmail(String email);

}