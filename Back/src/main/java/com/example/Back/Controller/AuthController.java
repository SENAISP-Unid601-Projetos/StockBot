package com.example.Back.Controller;

import com.example.Back.Dto.AuthDTO;
import com.example.Back.Dto.LoginResponseDTO;
import com.example.Back.Dto.RegisterDTO;
import com.example.Back.Service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthDTO data) {
        String token = authService.login(data);
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody @Valid RegisterDTO data) {
        authService.register(data);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody @Valid EmailRequestDTO body) {
        try {
            authService.recuperarSenha(body.email());
            return ResponseEntity.ok("Se o e-mail existir, uma nova senha será enviada.");
        } catch (RuntimeException e) {
            // Por segurança, não devemos dizer se o email existe ou não (User Enumeration)
            // Mas para facilitar o desenvolvimento agora, retornamos o erro.
            // Em produção, retorne sempre 200 OK.
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DTO interno para o endpoint de esqueci senha
    public record EmailRequestDTO(@NotBlank @Email String email) {}
}