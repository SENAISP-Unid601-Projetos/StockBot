package com.example.Back.Controller;

import com.example.Back.Dto.CreateUserDTO;
import com.example.Back.Entity.Usuario;
import com.example.Back.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Endpoint para LISTAR todos os utilizadores (só para ADMIN)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = userService.listarTodosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    // Endpoint para DELETAR um utilizador (só para ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        userService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint para CRIAR um novo utilizador (só para ADMIN)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Usuario> criarUsuario(@RequestBody @Valid CreateUserDTO createUserDTO) {
        // A anotação @Valid aqui garante que as regras do DTO sejam verificadas.
        Usuario novoUsuario = userService.criarUsuario(createUserDTO);
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }
}
