package com.example.Back.Service;

import com.example.Back.DTO.ProfessorDTO;
import com.example.Back.Entity.Professor;
import com.example.Back.Mapper.ProfessorMapper;
import com.example.Back.Repository.ProfessorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final ProfessorMapper professorMapper;

    @Autowired
    public ProfessorService(ProfessorRepository professorRepository,
                            ProfessorMapper professorMapper) {
        this.professorRepository = professorRepository;
        this.professorMapper = professorMapper;
    }

    @Transactional
    public ProfessorDTO criarProfessor(ProfessorDTO professorDTO) {
        Professor professor = professorMapper.toProfessorEntity(professorDTO);
        Professor salvo = professorRepository.save(professor);
        return professorMapper.toProfessorDTO(salvo);
    }

    public ProfessorDTO buscarPorId(Long id) {
        return professorRepository.findById(id)
                .map(professorMapper::toProfessorDTO)
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado"));
    }

    public List<ProfessorDTO> listarTodos() {
        return professorRepository.findAll().stream()
                .map(professorMapper::toProfessorDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProfessorDTO atualizarProfessor(Long id, ProfessorDTO professorDTO) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado"));

        professorMapper.updateProfessorFromDTO(professorDTO, professor);
        Professor atualizado = professorRepository.save(professor);

        return professorMapper.toProfessorDTO(atualizado);
    }

    @Transactional
    public void deletarProfessor(Long id) {
        professorRepository.deleteById(id);
    }

    public ProfessorDTO buscarPorCpf(String cpf) {
        return professorRepository.findByCpf(cpf)
                .map(professorMapper::toProfessorDTO)
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado com CPF: " + cpf));
    }
}