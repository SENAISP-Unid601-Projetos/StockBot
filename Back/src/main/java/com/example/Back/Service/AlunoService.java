package com.example.Back.Service;

import com.example.Back.DTO.AlunoCreatedDTO;
import com.example.Back.DTO.AlunoDTO;
import com.example.Back.Entity.Aluno;
import com.example.Back.Entity.Matricula;
import com.example.Back.Entity.MatriculaStatus;
import com.example.Back.Mapper.AlunoMapper;
import com.example.Back.Repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;

    @Autowired
    public AlunoService(AlunoRepository alunoRepository) {
        this.alunoRepository = alunoRepository;
    }

    @Transactional
    public AlunoDTO criarAluno(AlunoDTO alunoDTO) {
        Aluno aluno = toAlunoEntity(alunoDTO);
        Aluno alunoSalvo = alunoRepository.save(aluno);
        return AlunoMapper.INSTANCE.toAlunoDTO(alunoSalvo);
    }

    public List<AlunoDTO> listarTodosAlunos() {
        return alunoRepository.findAll()
                .stream()
                .map(AlunoMapper.INSTANCE::toAlunoDTO)
                .collect(Collectors.toList());
    }

    public AlunoDTO buscarAlunoPorId(Long id) {
        return alunoRepository.findById(id)
                .map(AlunoMapper.INSTANCE::toAlunoDTO)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com o ID: " + id));
    }

    @Transactional
    public AlunoDTO atualizarAluno(Long id, AlunoDTO alunoDTO) {
        return alunoRepository.findById(id)
                .map(alunoExistente -> {
                    alunoExistente.setData_ingresso(alunoDTO.getData_ingresso());
                    alunoExistente.setData_evasao(alunoDTO.getData_evasao());

                    Aluno alunoAtualizado = alunoRepository.save(alunoExistente);
                    return AlunoMapper.INSTANCE.toAlunoDTO(alunoAtualizado);
                })
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com o ID: " + id));
    }

    @Transactional
    public void deletarAluno(Long id) {
        alunoRepository.deleteById(id);
    }

    public List<AlunoDTO> buscarAlunosPorNome(String nome) {
        return alunoRepository.findByNomeContainingIgnoreCase(nome)
                .stream()
                .map(AlunoMapper.INSTANCE::toAlunoDTO)
                .collect(Collectors.toList());
    }

//    private Aluno toAlunoEntity(AlunoDTO dto) {
//        Aluno aluno = new Aluno();
//        aluno.setData_ingresso(dto.getData_ingresso());
//        aluno.setData_evasao(dto.getData_evasao());
//
//        Matricula matricula = new Matricula();
//        matricula.setAlunoId(null); // Will be set after aluno is saved
//        matricula.setCursoId(dto.getCursoId());
//        matricula.setDataMatricula(dto.getData_ingresso() != null ? dto.getData_ingresso().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate() : LocalDate.now());
//        matricula.setStatus(MatriculaStatus.valueOf(dto.getStatus() != null ? dto.getStatus() : "ATIVO"));
//
//        aluno.setMatricula(List.of(matricula));
//        return aluno;
//    }
}
