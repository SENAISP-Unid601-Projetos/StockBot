package com.example.Back.Service;

import com.example.Back.Entity.Historico;
import com.example.Back.Repository.HistoricoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class HistoricoService {

    @Autowired
    private HistoricoRepository historicoRepository;

    /**
     * Retorna uma lista com todos os registros de histórico.
     * @return Uma lista de objetos Historico.
     */
    public List<Historico> getAllHistorico() {
        return historicoRepository.findAll();
    }

    /**
     * Busca um registro de histórico pelo seu ID.
     * @param id O ID do registro de histórico.
     * @return Um Optional contendo o Historico, se encontrado.
     */
    public Optional<Historico> getHistoricoById(Long id) {
        return historicoRepository.findById(id);
    }

    /**
     * Salva um novo registro de histórico no banco de dados.
     * @param historico O objeto Historico a ser salvo.
     * @return O Historico salvo, incluindo o ID gerado.
     */
    public Historico saveHistorico(Historico historico) {
        // Validações adicionais, se necessário (ex: verificar se o componente existe)
        return historicoRepository.save(historico);
    }

    /**
     * Atualiza um registro de histórico existente.
     * @param id O ID do registro a ser atualizado.
     * @param historicoDetails O objeto Historico com as informações atualizadas.
     * @return Um Optional contendo o Historico atualizado, ou vazio se não encontrado.
     */
    public Optional<Historico> updateHistorico(Long id, Historico historicoDetails) {
        return historicoRepository.findById(id).map(historico -> {
            historico.setCodigoMovimentacao(historicoDetails.getCodigoMovimentacao());
            historico.setDataHora(historicoDetails.getDataHora());
            historico.setTipo(historicoDetails.getTipo());
            historico.setComponente(historicoDetails.getComponente());
            historico.setQuantidade(historicoDetails.getQuantidade());
            historico.setUsuario(historicoDetails.getUsuario());
            return historicoRepository.save(historico);
        });
    }

    /**
     * Deleta um registro de histórico pelo seu ID.
     * @param id O ID do registro de histórico a ser deletado.
     * @return true se o registro foi deletado, false caso contrário.
     */
    public boolean deleteHistorico(Long id) {
        if (historicoRepository.existsById(id)) {
            historicoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}