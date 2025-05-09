-- Criação do Banco de Dados
DROP DATABASE IF EXISTS stockbot_db;
CREATE DATABASE stockbot_db;
USE stockbot_db;

-- Tabela de Usuários com Perfis Ampliados
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    perfil ENUM('admin', 'coordenacao', 'professor', 'comum') NOT NULL DEFAULT 'comum',
    senha_hash VARCHAR(255) NOT NULL
) ENGINE = InnoDB;

-- Tabela de Permissões
CREATE TABLE permissoes (
    id_permissao INT AUTO_INCREMENT PRIMARY KEY,
    perfil ENUM('admin', 'coordenacao', 'professor', 'comum') NOT NULL,
    acao VARCHAR(50) NOT NULL,
    permitido BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (perfil, acao)
) ENGINE = InnoDB;

-- Tabela de Materiais
CREATE TABLE materiais (
    id_material INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    categoria ENUM('Ferramenta', 'Equipamento', 'Consumível') NOT NULL,
    quantidade INT NOT NULL DEFAULT 0,
    estoque_minimo INT NOT NULL DEFAULT 5,
    localizacao VARCHAR(50)
) ENGINE = InnoDB;

-- Inserção de Permissões Básicas
INSERT INTO permissoes (perfil, acao, permitido) VALUES
('coordenacao', 'DELETAR_MATERIAL', TRUE),
('coordenacao', 'REGISTRAR_MATERIAL', TRUE),
('professor', 'REGISTRAR_MATERIAL', TRUE),
('admin', 'DELETAR_MATERIAL', TRUE);

-- Procedure de Verificação de Permissão
DELIMITER //
CREATE PROCEDURE VerificarPermissao(
    IN p_usuario_id INT,
    IN p_acao VARCHAR(50),
    OUT p_permitido BOOLEAN
)
BEGIN
    DECLARE user_profile ENUM('admin', 'coordenacao', 'professor', 'comum');
    
    SELECT perfil INTO user_profile FROM usuarios WHERE id_usuario = p_usuario_id;
    SELECT permitido INTO p_permitido FROM permissoes 
    WHERE perfil = user_profile AND acao = p_acao;
    
    IF p_permitido IS NULL THEN SET p_permitido = FALSE; END IF;
END //
DELIMITER ;

-- Procedure para Deletar Materiais com Segurança
DELIMITER //
CREATE PROCEDURE DeletarMaterialSeguro(
    IN p_usuario_id INT,
    IN p_material_id INT
)
BEGIN
    DECLARE permissao BOOLEAN;
    
    CALL VerificarPermissao(p_usuario_id, 'DELETAR_MATERIAL', permissao);
    
    IF permissao THEN
        DELETE FROM materiais WHERE id_material = p_material_id;
        SELECT 'SUCESSO: Material deletado' AS resultado;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ERRO: Acesso negado para deletar';
    END IF;
END //
DELIMITER ;

-- Procedure para Registrar Materiais com Segurança
DELIMITER //
CREATE PROCEDURE RegistrarMaterialSeguro(
    IN p_usuario_id INT,
    IN p_nome VARCHAR(100),
    IN p_descricao TEXT,
    IN p_categoria ENUM('Ferramenta', 'Equipamento', 'Consumível'),
    IN p_quantidade INT,
    IN p_estoque_minimo INT,
    IN p_localizacao VARCHAR(50)
)
BEGIN
    DECLARE permissao BOOLEAN;
    
    CALL VerificarPermissao(p_usuario_id, 'REGISTRAR_MATERIAL', permissao);
    
    IF permissao THEN
        INSERT INTO materiais (nome, descricao, categoria, quantidade, estoque_minimo, localizacao)
        VALUES (p_nome, p_descricao, p_categoria, p_quantidade, p_estoque_minimo, p_localizacao);
        SELECT 'SUCESSO: Material registrado' AS resultado;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ERRO: Acesso negado para registrar';
    END IF;
END //
DELIMITER ;

-- Dados de Teste
INSERT INTO usuarios (nome, email, perfil, senha_hash) VALUES
('Coordenador', 'coordenacao@email.com', 'coordenacao', 'hash_seguro'),
('Professor', 'professor@email.com', 'professor', 'hash_seguro'),
('Usuário Comum', 'comum@email.com', 'comum', 'hash_seguro');

INSERT INTO materiais (nome, categoria, quantidade) VALUES
('Martelo', 'Ferramenta', 10),
('Parafusadeira', 'Equipamento', 5);

-- Testes (Execute em Ordem)
-- 1. Tentar registrar material como Coordenador (SUCESSO)
CALL RegistrarMaterialSeguro(1, 'Alicate', 'Descrição', 'Ferramenta', 15, 3, 'Prateleira A');

-- 2. Tentar registrar material como Professor (SUCESSO)
CALL RegistrarMaterialSeguro(2, 'Chave de Fenda', 'Descrição', 'Ferramenta', 20, 2, 'Prateleira B');

-- 3. Tentar registrar material como Usuário Comum (ERRO)
CALL RegistrarMaterialSeguro(3, 'Serra', 'Descrição', 'Equipamento', 8, 1, 'Prateleira C');

-- 4. Tentar deletar material como Coordenador (SUCESSO)
CALL DeletarMaterialSeguro(1, 1);

-- 5. Tentar deletar material como Professor (ERRO)
CALL DeletarMaterialSeguro(2, 2);

-- 6. Tentar deletar material como Usuário Comum (ERRO)
CALL DeletarMaterialSeguro(3, 2);