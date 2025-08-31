package com.example.Back.Controller;

import com.example.Back.Dto.CreateUserDTO;
import com.example.Back.Dto.UserResponseDTO; // Importe o DTO de resposta
import com.example.Back.Service.UsuarioService;
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
    private UsuarioService usuarioService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> listarUsuarios() { // Agora retorna List<UserResponseDTO>
        List<UserResponseDTO> usuarios = usuarioService.listarTodosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        usuarioService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> criarUsuario(@Valid @RequestBody CreateUserDTO createUserDTO) { // Agora retorna UserResponseDTO
        UserResponseDTO novoUsuario = usuarioService.criarUsuario(createUserDTO);
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }
}
