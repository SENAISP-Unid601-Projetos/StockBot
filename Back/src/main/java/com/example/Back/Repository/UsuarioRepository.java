package com.example.Back.Repository;

import com.example.Back.Entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByEmail(String email);
    // MELHORIA: Retorna um Optional para evitar NullPointerExceptions
    Optional<Usuario> findByEmail(String email);

    // O Spring Security também consegue trabalhar com UserDetails
    UserDetails findUserDetailsByEmail(String email);

    // Spring Security usa este método para carregar detalhes (se necessário no futuro)
    default UserDetails loadUserByUsername(String username) {
        return findByEmail(username).orElse(null);
    }

    List<Usuario> findAllByEmpresaId(Long empresaId);

    Optional<Usuario> findByIdAndEmpresaId(Long id, Long empresaId);

    // Adicionamos este para o AuthorizationService funcionar corretamente se ele usar findByEmail ou similar
    // (O seu AuthorizationService já usa findByEmail, então está tudo certo).
}