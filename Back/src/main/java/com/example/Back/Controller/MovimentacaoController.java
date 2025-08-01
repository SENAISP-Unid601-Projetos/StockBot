// src/main/java/com/example/Back/Controller/MovimentacaoController.java
package com.example.Back.Controller;

import com.example.Back.DTO.*;
import com.example.Back.Repository.MovimentacaoRepository;
import com.example.Back.Service.MovimentacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movimentacoes")
@RequiredArgsConstructor
public class MovimentacaoController {
    private final MovimentacaoRepository movimentacaoService;

    @PostMapping
    public ResponseEntity<MovimentacaoResponseDTO> registrarMovimentacao(
            @RequestBody @Valid RegistroMovimentacaoDTO dto,
            @RequestHeader("X-Usuario-Id") Long usuarioId) {

        MovimentacaoResponseDTO response = movimentacaoService.registrarMovimentacao(dto, usuarioId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}