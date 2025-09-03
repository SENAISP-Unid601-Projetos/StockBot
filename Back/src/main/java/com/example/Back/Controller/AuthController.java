package com.example.Back.Controller;

import com.example.Back.Dto.AuthDTO;
import com.example.Back.Dto.LoginResponseDTO;
import com.example.Back.Dto.RegisterDTO; // Usaremos um DTO para registo também
import com.example.Back.Service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    // Injeção via construtor
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
}
