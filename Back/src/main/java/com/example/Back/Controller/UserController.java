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
        System.out.println("=== [DEBUG] UserController.listarUsuarios() chamado ===");
        System.out.println("[DEBUG] Verificando permissões ADMIN...");

        List<Usuario> usuarios = userService.listarTodosUsuarios();

        System.out.println("[DEBUG] Número de usuários encontrados: " + usuarios.size());
        System.out.println("[DEBUG] Retornando lista de usuários com status 200");
        return ResponseEntity.ok(usuarios);
    }

    // Endpoint para DELETAR um utilizador (só para ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        System.out.println("=== [DEBUG] UserController.deletarUsuario() chamado ===");
        System.out.println("[DEBUG] ID do usuário a ser deletado: " + id);
        System.out.println("[DEBUG] Verificando permissões ADMIN...");

        userService.deletarUsuario(id);

        System.out.println("[DEBUG] Usuário com ID " + id + " deletado com sucesso");
        System.out.println("[DEBUG] Retornando status 204 No Content");
        return ResponseEntity.noContent().build();
    }

    // Endpoint para CRIAR um novo utilizador (só para ADMIN)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Usuario> criarUsuario(@RequestBody @Valid CreateUserDTO createUserDTO) {
        System.out.println("=== [DEBUG] UserController.criarUsuario() chamado ===");
        System.out.println("[DEBUG] DTO recebido: " + createUserDTO.toString());
        System.out.println("[DEBUG] Verificando permissões ADMIN...");
        System.out.println("[DEBUG] Validando DTO com @Valid...");

        // A anotação @Valid aqui garante que as regras do DTO sejam verificadas.
        Usuario novoUsuario = userService.criarUsuario(createUserDTO);

        System.out.println("[DEBUG] Usuário criado com ID: " + novoUsuario.getId());
        System.out.println("[DEBUG] Retornando usuário criado com status 201 Created");
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }
}