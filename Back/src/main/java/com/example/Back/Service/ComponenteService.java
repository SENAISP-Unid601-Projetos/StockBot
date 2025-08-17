package com.example.Back.Service;

import com.example.Back.Entity.Componente;
import com.example.Back.Repository.ComponenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service // Anotação que identifica a classe como um serviço do Spring
public class ComponenteService {

    // Injeção de dependência do ComponenteRepository
    @Autowired
    private ComponenteRepository componenteRepository;

    /**
     * Salva ou atualiza um componente no banco de dados.
     * @param componente O objeto Componente a ser salvo.
     * @return O Componente salvo, com o ID gerado pelo banco de dados.
     */
    public Componente salvarComponente(Componente componente) {
        // Lógica de negócio pode ser adicionada aqui antes de salvar
        // Ex: Validação de campos, regras específicas, etc.
        return componenteRepository.save(componente);
    }

    /**
     * Retorna a lista de todos os componentes cadastrados.
     * @return Uma lista de objetos Componente.
     */
    public List<Componente> listarTodosComponentes() {
        return componenteRepository.findAll();
    }

    /**
     * Busca um componente pelo seu ID.
     * @param id O ID do componente.
     * @return Um Optional contendo o Componente, se encontrado, ou vazio.
     */
    public Optional<Componente> encontrarPorId(Long id) {
        return componenteRepository.findById(id);
    }

    /**
     * Deleta um componente do banco de dados pelo seu ID.
     * @param id O ID do componente a ser deletado.
     */
    public void deletarComponente(Long id) {
        componenteRepository.deleteById(id);
    }

    // Você pode adicionar outros métodos conforme a sua necessidade, como
    // buscar por código de patrimônio, por categoria, etc.
}