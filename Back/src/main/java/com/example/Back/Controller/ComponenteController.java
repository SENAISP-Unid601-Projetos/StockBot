package com.example.Back.Controller;

import com.example.Back.Dto.ComponenteDTO;
import com.example.Back.Entity.Componente;
import com.example.Back.Service.ComponenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/componentes")
public class ComponenteController {

    @Autowired
    private ComponenteService componenteService;

    @GetMapping
    public ResponseEntity<List<Componente>> listarTodosComponentes() {
        System.out.println("[CONTROLLER] Requisição GET para /api/componentes recebida.");
        List<Componente> componentes = componenteService.listarTodosComponentes();
        System.out.println("[CONTROLLER] Retornando " + componentes.size() + " componentes.");
        return new ResponseEntity<>(componentes, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Componente> encontrarComponentePorId(@PathVariable Long id) {
        System.out.println("[CONTROLLER] Requisição GET para /api/componentes/" + id);
        return componenteService.encontrarPorId(id)
                .map(componente -> {
                    System.out.println("[CONTROLLER] Componente encontrado: " + componente.getNome());
                    return new ResponseEntity<>(componente, HttpStatus.OK);
                })
                .orElseGet(() -> {
                    System.out.println("[CONTROLLER] Componente com ID " + id + " não encontrado.");
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                });
    }

    @PostMapping
    public ResponseEntity<Componente> cadastrarComponente(@RequestBody ComponenteDTO componenteDTO) {
        System.out.println("[CONTROLLER] Requisição POST para /api/componentes com dados: " + componenteDTO);
        Componente novoComponente = mapDtoToEntity(componenteDTO);
        Componente componenteSalvo = componenteService.salvarComponente(novoComponente);
        System.out.println("[CONTROLLER] Componente cadastrado com sucesso. ID: " + componenteSalvo.getId());
        return new ResponseEntity<>(componenteSalvo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Componente> atualizarComponente(@PathVariable Long id, @RequestBody ComponenteDTO componenteDTO) {
        System.out.println("[CONTROLLER] Requisição PUT para /api/componentes/" + id + " com dados: " + componenteDTO);
        Componente componenteAtualizado = mapDtoToEntity(componenteDTO);
        componenteAtualizado.setId(id);
        Componente componenteSalvo = componenteService.salvarComponente(componenteAtualizado);
        System.out.println("[CONTROLLER] Componente atualizado com sucesso. ID: " + componenteSalvo.getId());
        return new ResponseEntity<>(componenteSalvo, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarComponente(@PathVariable Long id) {
        System.out.println("[CONTROLLER] Requisição DELETE para /api/componentes/" + id);
        componenteService.deletarComponente(id);
        System.out.println("[CONTROLLER] Componente deletado com sucesso.");
        return ResponseEntity.noContent().build();
    }

    private Componente mapDtoToEntity(ComponenteDTO dto) {
        Componente componente = new Componente();
        componente.setNome(dto.getNome());
        componente.setCodigoPatrimonio(dto.getCodigoPatrimonio());
        componente.setQuantidade(dto.getQuantidade());
        componente.setLocalizacao(dto.getLocalizacao());
        componente.setCategoria(dto.getCategoria());
        componente.setObservacoes(dto.getObservacoes());
        return componente;
    }
}
