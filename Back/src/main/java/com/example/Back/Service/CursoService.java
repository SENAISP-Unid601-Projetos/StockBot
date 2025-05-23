package com.example.Back.Service;

import com.example.Back.DTO.CursoDTO;
import com.example.Back.Entity.Curso;
import com.example.Back.Repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CursoService {

    private final CursoRepository cursoRepository;

    @Autowired
    public CursoService(CursoRepository cursoRepository) {
        this.cursoRepository = cursoRepository;
    }

    @Transactional
    public CursoDTO criarCurso(CursoDTO cursoDTO) {
        Curso curso = toEntity(cursoDTO);
        Curso cursoSalvo = cursoRepository.save(curso);
        return toDTO(cursoSalvo);
    }

    public List<CursoDTO> listarTodosCursos() {
        return cursoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CursoDTO buscarCursoPorId(Long id) {
        Optional<Curso> cursoOptional = cursoRepository.findById(id);
        return cursoOptional.map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado com o ID: " + id));
    }

    @Transactional
    public CursoDTO atualizarCurso(Long id, CursoDTO cursoDTO) {
        return cursoRepository.findById(id)
                .map(cursoExistente -> {
                    cursoExistente.setCodigo(cursoDTO.getCodigo());
                    cursoExistente.setNome(cursoDTO.getNome());
                    cursoExistente.setCargaHoraria(cursoDTO.getCargaHoraria());
                    cursoExistente.setDataInicio(cursoDTO.getDataInicio());
                    cursoExistente.setDataTermino(cursoDTO.getDataTermino());

                    Curso cursoAtualizado = cursoRepository.save(cursoExistente);
                    return toDTO(cursoAtualizado);
                })
                .orElseThrow(() -> new RuntimeException("Curso não encontrado com o ID: " + id));
    }

    @Transactional
    public void deletarCurso(Long id) {
        cursoRepository.deleteById(id);
    }

    public List<CursoDTO> buscarCursosPorNome(String nome) {
        return cursoRepository.findByNomeContainingIgnoreCase(nome)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private CursoDTO toDTO(Curso curso) {
        CursoDTO dto = new CursoDTO();
        dto.setIdCurso(curso.getIdCurso());
        dto.setCodigo(curso.getCodigo());
        dto.setNome(curso.getNome());
        dto.setCargaHoraria(curso.getCargaHoraria());
        dto.setDataInicio(curso.getDataInicio());
        dto.setDataTermino(curso.getDataTermino());
        return dto;
    }

    private Curso toEntity(CursoDTO dto) {
        Curso curso = new Curso();
        curso.setIdCurso(dto.getIdCurso());
        curso.setCodigo(dto.getCodigo());
        curso.setNome(dto.getNome());
        curso.setCargaHoraria(dto.getCargaHoraria());
        curso.setDataInicio(dto.getDataInicio());
        curso.setDataTermino(dto.getDataTermino());
        return curso;
    }
}