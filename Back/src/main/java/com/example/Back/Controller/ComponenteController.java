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


    @PostMapping
    public ResponseEntity<Componente> cadastrarComponente(@RequestBody ComponenteDTO componenteDTO) {
        // Mapeia o DTO para a Entity
        Componente novoComponente = new Componente();
        novoComponente.setNome(componenteDTO.getNome());
        novoComponente.setCodigoPatrimonio(componenteDTO.getCodigoPatrimonio());
        novoComponente.setQuantidade(componenteDTO.getQuantidade());
        novoComponente.setLocalizacao(componenteDTO.getLocalizacao());
        novoComponente.setCategoria(componenteDTO.getCategoria());
        novoComponente.setObservacoes(componenteDTO.getObservacoes());


        Componente componenteSalvo = componenteService.salvarComponente(novoComponente);
        return new ResponseEntity<>(componenteSalvo, HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<List<Componente>> listarTodosComponentes() {
        List<Componente> componentes = componenteService.listarTodosComponentes();
        return new ResponseEntity<>(componentes, HttpStatus.OK);
    }
}
