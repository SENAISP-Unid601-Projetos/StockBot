// CursoService.java
package com.example.Back.Service;

import com.example.Back.DTO.CursoCreateDTO;
import com.example.Back.DTO.CursoResponseDTO;
import com.example.Back.Entity.Curso;

import com.example.Back.Mapper.CursoMapper;
import com.example.Back.Repository.CursoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CursoService {

    private final CursoRepository cursoRepository;
    private final CursoMapper cursoMapper;

    @Autowired
    public CursoService(CursoRepository cursoRepository, CursoMapper cursoMapper) {
        this.cursoRepository = cursoRepository;
        this.cursoMapper = cursoMapper;
    }

    @Transactional
    public CursoResponseDTO criarCurso(CursoCreateDTO cursoCreateDTO) {
        Curso curso = cursoMapper.toEntity(cursoCreateDTO);
        Curso cursoSalvo = cursoRepository.save(curso);
        return cursoMapper.toResponseDTO(cursoSalvo);
    }

    public List<CursoResponseDTO> listarTodosCursos() {
        return cursoRepository.findAll().stream()
                .map(cursoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public CursoResponseDTO buscarCursoPorId(Long id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Curso não encontrado com o ID: " + id));
        return cursoMapper.toResponseDTO(curso);
    }

    @Transactional
    public CursoResponseDTO atualizarCurso(Long id, CursoCreateDTO cursoCreateDTO) {
        Curso cursoExistente = cursoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Curso não encontrado com o ID: " + id));

        cursoMapper.updateCursoFromCreateDTO(cursoCreateDTO, cursoExistente);
        Curso cursoAtualizado = cursoRepository.save(cursoExistente);

        return cursoMapper.toResponseDTO(cursoAtualizado);
    }

    @Transactional
    public void deletarCurso(Long id) {
        if (!cursoRepository.existsById(id)) {
            throw new EntityNotFoundException("Curso não encontrado com o ID: " + id);
        }
        cursoRepository.deleteById(id);
    }

    public List<CursoResponseDTO> buscarCursosPorNome(String nome) {
        return cursoRepository.findByNomeContainingIgnoreCase(nome).stream()
                .map(cursoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}