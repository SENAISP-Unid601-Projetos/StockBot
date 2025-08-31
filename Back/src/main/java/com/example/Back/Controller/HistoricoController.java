package com.example.Back.Controller;

import com.example.Back.Dto.HistoricoDTO;
import com.example.Back.Service.HistoricoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/historico")
public class HistoricoController {

    private static final Logger logger = LoggerFactory.getLogger(HistoricoController.class);

    @Autowired
    private HistoricoService historicoService;

    @GetMapping
    public ResponseEntity<List<HistoricoDTO>> getAllHistorico() {
        logger.info("📋 GET /api/historico - Buscando todo o histórico");
        try {
            List<HistoricoDTO> historicos = historicoService.getAllHistorico();
            logger.info("✅ GET /api/historico - Encontrados {} registros históricos", historicos.size());
            logger.debug("📊 Registros encontrados: {}", historicos);
            return ResponseEntity.ok(historicos);
        } catch (Exception e) {
            logger.error("❌ GET /api/historico - Erro ao buscar histórico: {}", e.getMessage());
            logger.debug("🔧 Stack trace: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistoricoDTO> getHistoricoById(@PathVariable Long id) {
        logger.info("🔍 GET /api/historico/{} - Buscando histórico por ID", id);
        try {
            return historicoService.getHistoricoById(id)
                    .map(historico -> {
                        logger.info("✅ GET /api/historico/{} - Histórico encontrado", id);
                        logger.debug("📋 Detalhes do histórico: {}", historico);
                        return ResponseEntity.ok(historico);
                    })
                    .orElseGet(() -> {
                        logger.warn("⚠️ GET /api/historico/{} - Histórico não encontrado", id);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            logger.error("❌ GET /api/historico/{} - Erro ao buscar histórico: {}", id, e.getMessage());
            logger.debug("🔧 Stack trace: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<HistoricoDTO> createHistorico(@RequestBody HistoricoDTO historicoDto) {
        logger.info("➕ POST /api/historico - Criando novo registro histórico");
        logger.debug("📦 Dados recebidos: {}", historicoDto);

        try {
            // Validação básica dos dados
            if (historicoDto == null) {
                logger.warn("⚠️ POST /api/historico - Dados nulos recebidos");
                return ResponseEntity.badRequest().build();
            }

            HistoricoDTO novoHistorico = historicoService.createHistorico(historicoDto);
            logger.info("✅ POST /api/historico - Registro histórico criado com ID: {}", novoHistorico.getId());
            logger.debug("📋 Novo histórico: {}", novoHistorico);
            return new ResponseEntity<>(novoHistorico, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("❌ POST /api/historico - Erro ao criar histórico: {}", e.getMessage());
            logger.debug("🔧 Stack trace: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistoricoDTO> updateHistorico(@PathVariable Long id, @RequestBody HistoricoDTO historicoDetailsDto) {
        logger.info("✏️ PUT /api/historico/{} - Atualizando registro histórico", id);
        logger.debug("📦 Dados recebidos para atualização: {}", historicoDetailsDto);

        try {
            if (historicoDetailsDto == null) {
                logger.warn("⚠️ PUT /api/historico/{} - Dados nulos recebidos", id);
                return ResponseEntity.badRequest().build();
            }

            return historicoService.updateHistorico(id, historicoDetailsDto)
                    .map(historicoAtualizado -> {
                        logger.info("✅ PUT /api/historico/{} - Histórico atualizado com sucesso", id);
                        logger.debug("📋 Histórico atualizado: {}", historicoAtualizado);
                        return ResponseEntity.ok(historicoAtualizado);
                    })
                    .orElseGet(() -> {
                        logger.warn("⚠️ PUT /api/historico/{} - Histórico não encontrado para atualização", id);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            logger.error("❌ PUT /api/historico/{} - Erro ao atualizar histórico: {}", id, e.getMessage());
            logger.debug("🔧 Stack trace: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHistorico(@PathVariable Long id) {
        logger.info("🗑️ DELETE /api/historico/{} - Excluindo registro histórico", id);

        try {
            boolean deletado = historicoService.deleteHistorico(id);
            if (deletado) {
                logger.info("✅ DELETE /api/historico/{} - Histórico excluído com sucesso", id);
                return ResponseEntity.noContent().build();
            } else {
                logger.warn("⚠️ DELETE /api/historico/{} - Histórico não encontrado para exclusão", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("❌ DELETE /api/historico/{} - Erro ao excluir histórico: {}", id, e.getMessage());
            logger.debug("🔧 Stack trace: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Método auxiliar para logging seguro
    private String safeLog(Object object) {
        if (object == null) return "null";
        String str = object.toString();
        if (str.length() > 150) {
            return str.substring(0, 150) + "...";
        }
        return str;
    }
}