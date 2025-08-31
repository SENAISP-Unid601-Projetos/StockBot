package com.example.Back.Dto;

import com.example.Back.Entity.Componente;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComponenteDTO {

    private static final Logger logger = LoggerFactory.getLogger(ComponenteDTO.class);

    private Long id; // É uma boa prática incluir o ID no DTO
    private String nome;
    private String codigoPatrimonio;
    private int quantidade;
    private String localizacao;
    private String categoria;
    private String observacoes;

    // ESTE É O CONSTRUTOR QUE FALTAVA
    // Ele "traduz" uma Entidade Componente para um ComponenteDTO
    public ComponenteDTO(Componente componente) {
        logger.debug("🔄 Convertendo Entity Componente para DTO");
        logger.debug("📦 Componente original: {}", componente);

        try {
            this.id = componente.getId();
            this.nome = componente.getNome();
            this.codigoPatrimonio = componente.getCodigoPatrimonio();
            this.quantidade = componente.getQuantidade();
            this.localizacao = componente.getLocalizacao();
            this.categoria = componente.getCategoria();
            this.observacoes = componente.getObservacoes();

            logger.debug("✅ DTO criado com sucesso: {}", this);
            logger.debug("📋 Detalhes - ID: {}, Nome: {}, Quantidade: {}",
                    id, nome, quantidade);

        } catch (Exception e) {
            logger.error("❌ Erro ao converter Componente para DTO: {}", e.getMessage());
            logger.debug("🔧 Stack trace: ", e);
            throw new RuntimeException("Erro na conversão para DTO", e);
        }
    }

    // Adicionando um método toString personalizado para logging
    @Override
    public String toString() {
        return String.format(
                "ComponenteDTO{id=%d, nome='%s', codigoPatrimonio='%s', quantidade=%d, localizacao='%s', categoria='%s', observacoes='%s'}",
                id, nome, codigoPatrimonio, quantidade, localizacao, categoria, observacoes
        );
    }

    // Método para logging detalhado (opcional)
    public void logDetails() {
        logger.debug("📊 DTO Detalhado:");
        logger.debug("   ID: {}", id);
        logger.debug("   Nome: {}", nome);
        logger.debug("   Código Patrimônio: {}", codigoPatrimonio);
        logger.debug("   Quantidade: {}", quantidade);
        logger.debug("   Localização: {}", localizacao);
        logger.debug("   Categoria: {}", categoria);
        logger.debug("   Observações: {}", observacoes);
    }

    // Método para validar os dados do DTO
    public boolean isValid() {
        logger.debug("🔍 Validando DTO...");

        boolean isValid = true;

        if (nome == null || nome.trim().isEmpty()) {
            logger.warn("⚠️  Nome inválido ou vazio");
            isValid = false;
        }

        if (quantidade < 0) {
            logger.warn("⚠️  Quantidade negativa: {}", quantidade);
            isValid = false;
        }

        if (categoria == null || categoria.trim().isEmpty()) {
            logger.warn("⚠️  Categoria inválida ou vazia");
            isValid = false;
        }

        logger.debug("✅ Validação concluída: {}", isValid ? "VÁLIDO" : "INVÁLIDO");
        return isValid;
    }
}