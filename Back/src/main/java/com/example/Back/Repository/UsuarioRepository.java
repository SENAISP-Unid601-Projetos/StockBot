package com.example.Back.Repository;

import com.example.Back.Entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.Optional; // Importa a classe Optional

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // MELHORIA: Retorna um Optional para evitar NullPointerExceptions
    Optional<Usuario> findByEmail(String email);

    // O Spring Security também consegue trabalhar com UserDetails
    UserDetails findUserDetailsByEmail(String email);
}
