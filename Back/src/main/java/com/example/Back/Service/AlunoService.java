package com.example.Back.Service;

import com.example.Back.DTO.AlunoCreatedDTO;
import com.example.Back.DTO.AlunoDTO;
import com.example.Back.Entity.Aluno;
import com.example.Back.Entity.Matricula;
import com.example.Back.Entity.MatriculaStatus;
import com.example.Back.Mapper.AlunoMapper;
import com.example.Back.Repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Camada de serviço responsável pela lógica de negócio dos Alunos.
 */
@Service
@RequiredArgsConstructor // Injeta as dependências (repository, mapper, encoder) via construtor.
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final AlunoMapper alunoMapper;
    private final PasswordEncoder passwordEncoder;

    /**
     * Cria um novo aluno no sistema.
     *
     * @param dto DTO contendo os dados para a criação do aluno.
     * @return DTO do aluno recém-criado.
     */
    @Transactional
    public AlunoDTO criarAluno(AlunoCreatedDTO dto) {
        // Validação para garantir que o e-mail não seja duplicado
        if (alunoRepository.findByEmail(dto.email()).isPresent()) {
            throw new IllegalArgumentException("O e-mail informado já está em uso.");
        }

        Aluno novoAluno = toAlunoEntity(dto);

        // Criptografa a senha antes de salvar no banco de dados
        novoAluno.setSenha(passwordEncoder.encode(dto.senha()));

        Aluno alunoSalvo = alunoRepository.save(novoAluno);
        return alunoMapper.toDto(alunoSalvo);
    }

    /**
     * Lista todos os alunos cadastrados.
     *
     * @return Uma lista de DTOs de alunos.
     */
    @Transactional(readOnly = true)
    public List<AlunoDTO> listarTodosAlunos() {
        return alunoRepository.findAll()
                .stream()
                .map(alunoMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Busca um aluno específico pelo seu ID.
     *
     * @param id O ID do aluno.
     * @return O DTO do aluno encontrado.
     * @throws RuntimeException se o aluno não for encontrado.
     */
    @Transactional(readOnly = true)
    public AlunoDTO buscarAlunoPorId(Long id) {
        return alunoRepository.findById(id)
                .map(alunoMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com o ID: " + id));
    }

    /**
     * Busca alunos cujo nome contenha o texto fornecido.
     *
     * @param nome O texto a ser pesquisado no nome dos alunos.
     * @return Uma lista de DTOs de alunos encontrados.
     */
    @Transactional(readOnly = true)
    public List<AlunoDTO> buscarAlunosPorNome(String nome) {
        return alunoRepository.findByNomeContainingIgnoreCase(nome)
                .stream()
                .map(alunoMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Atualiza os dados de um aluno existente.
     *
     * @param id O ID do aluno a ser atualizado.
     * @param alunoDTO DTO com os novos dados.
     * @return O DTO do aluno atualizado.
     */
    @Transactional
    public AlunoDTO atualizarAluno(Long id, AlunoDTO alunoDTO) {
        Aluno alunoExistente = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com o ID: " + id));

        // Atualiza os campos da entidade com os dados do DTO
        alunoExistente.setNome(alunoDTO.nome());
        alunoExistente.setEmail(alunoDTO.email());
        alunoExistente.setData_ingresso(alunoDTO.data_ingresso());
        alunoExistente.setData_evasao(alunoDTO.data_evasao());
        // A senha não é atualizada aqui por segurança. Crie um método específico para isso.

        Aluno alunoAtualizado = alunoRepository.save(alunoExistente);
        return alunoMapper.toDto(alunoAtualizado);
    }

    /**
     * Deleta um aluno do sistema.
     *
     * @param id O ID do aluno a ser deletado.
     */
    @Transactional
    public void deletarAluno(Long id) {
        if (!alunoRepository.existsById(id)) {
            throw new RuntimeException("Aluno não encontrado com o ID: " + id);
        }
        alunoRepository.deleteById(id);
    }

    /**
     * Realiza o login do aluno de forma segura.
     *
     * @param email O email do aluno.
     * @param senha A senha em texto plano.
     * @return O DTO do aluno se as credenciais forem válidas.
     * @throws RuntimeException se as credenciais forem inválidas.
     */
    @Transactional(readOnly = true)
    public AlunoDTO login(String email, String senha) {
        return alunoRepository.findByEmail(email)
                // Compara a senha enviada com o hash salvo no banco de dados
                .filter(aluno -> passwordEncoder.matches(senha, aluno.getSenha()))
                .map(alunoMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas"));
    }

    /**
     * Método auxiliar privado para converter o DTO de criação em uma entidade Aluno,
     * estabelecendo a relação bidirecional com a Matrícula.
     */
    private Aluno toAlunoEntity(AlunoCreatedDTO dto) {
        Aluno aluno = new Aluno();
        aluno.setNome(dto.nome());
        aluno.setEmail(dto.email());
        aluno.setData_ingresso(dto.data_ingresso());
        aluno.setData_evasao(dto.data_evasao());

        Matricula matricula = new Matricula();
        matricula.setCursoId(dto.cursoId());
        matricula.setDataMatricula(LocalDate.now());
        matricula.setStatus(MatriculaStatus.ATIVO);

        // Passo crucial: estabelece a relação nos dois sentidos para o JPA salvar em cascata.
        aluno.setMatricula(matricula);
        matricula.setAluno(aluno);

        return aluno;
    }
}