-- 1️⃣ Criação do banco
CREATE DATABASE IF NOT EXISTS curso_eletro;
USE curso_eletro;

-- 2️⃣ Lookup Table: Níveis de Acesso
CREATE TABLE Niveis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO Niveis (nome) VALUES ('coordenacao'), ('professor'), ('aluno');

-- 3️⃣ Tabela de Admins com referência ao nível
CREATE TABLE Admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nivel_id INT NOT NULL,
    FOREIGN KEY (nivel_id) REFERENCES Niveis(id)
);

CREATE INDEX idx_email_admin ON Admins(email);

-- 4️⃣ Ferramentas com soft delete
CREATE TABLE Ferramentas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_data_criacao ON Ferramentas(data_criacao);

-- 5️⃣ Tabela de relacionamento Admin-Ferramentas
CREATE TABLE Admin_Ferramentas (
    admin_id INT,
    ferramenta_id INT,
    PRIMARY KEY (admin_id, ferramenta_id),
    FOREIGN KEY (admin_id) REFERENCES Admins(id),
    FOREIGN KEY (ferramenta_id) REFERENCES Ferramentas(id)
);

-- 6️⃣ Log de Ações (Auditoria)
CREATE TABLE Logs_Acoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT,
    acao TEXT,
    tipo_acao ENUM('INSERT', 'DELETE', 'UPDATE', 'ACCESS'),
    tabela VARCHAR(50),
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES Admins(id)
);

CREATE INDEX idx_logs_data ON Logs_Acoes(data);

-- 7️⃣ Procedures Seguros
DELIMITER //

-- Criar novo admin com verificação e hash
CREATE PROCEDURE criar_admin (
    IN p_nome VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_senha TEXT,
    IN p_nivel_nome VARCHAR(50)
)
BEGIN
    DECLARE cnt INT;
    DECLARE nivel_id INT;

    SELECT COUNT(*) INTO cnt FROM Admins WHERE email = p_email;
    IF cnt > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email já cadastrado.';
    END IF;

    SELECT id INTO nivel_id FROM Niveis WHERE nome = p_nivel_nome;
    IF nivel_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Nível inválido.';
    END IF;

    INSERT INTO Admins (nome, email, senha, nivel_id)
    VALUES (p_nome, p_email, SHA2(p_senha, 256), nivel_id);
END //

-- Registrar ferramenta
CREATE PROCEDURE registrar_ferramenta (
    IN p_admin_id INT,
    IN p_nome VARCHAR(100),
    IN p_descricao TEXT
)
BEGIN
    DECLARE nivel_nome VARCHAR(50);

    SELECT n.nome INTO nivel_nome
    FROM Admins a
    JOIN Niveis n ON a.nivel_id = n.id
    WHERE a.id = p_admin_id;

    IF nivel_nome IN ('coordenacao', 'professor') THEN
        INSERT INTO Ferramentas (nome, descricao) VALUES (p_nome, p_descricao);
        INSERT INTO Logs_Acoes (admin_id, acao, tipo_acao, tabela)
        VALUES (p_admin_id, CONCAT('Registrou ferramenta: ', p_nome), 'INSERT', 'Ferramentas');
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Permissão negada para registrar ferramenta.';
    END IF;
END //

-- Remover ferramenta (soft delete)
CREATE PROCEDURE remover_ferramenta (
    IN p_admin_id INT,
    IN p_ferramenta_id INT
)
BEGIN
    DECLARE nivel_nome VARCHAR(50);

    SELECT n.nome INTO nivel_nome
    FROM Admins a
    JOIN Niveis n ON a.nivel_id = n.id
    WHERE a.id = p_admin_id;

    IF nivel_nome = 'coordenacao' THEN
        UPDATE Ferramentas SET ativo = FALSE WHERE id = p_ferramenta_id;
        INSERT INTO Logs_Acoes (admin_id, acao, tipo_acao, tabela)
        VALUES (p_admin_id, CONCAT('Soft delete ferramenta ID: ', p_ferramenta_id), 'DELETE', 'Ferramentas');
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Permissão negada para remover ferramenta.';
    END IF;
END //

DELIMITER ;

-- 8️⃣ Views para controle de acesso (RBAC básico)
CREATE VIEW Ferramentas_Ativas AS
SELECT * FROM Ferramentas WHERE ativo = TRUE;

CREATE VIEW Admins_Com_Nivel AS
SELECT a.id, a.nome, a.email, n.nome AS nivel
FROM Admins a
JOIN Niveis n ON a.nivel_id = n.id;

-- 9️⃣ Inserção de exemplo
CALL criar_admin('Coord Exemplo', 'coord@exemplo.com', 'senha123', 'coordenacao');
CALL criar_admin('Prof Exemplo', 'prof@exemplo.com', 'senha123', 'professor');
CALL criar_admin('Aluno Exemplo', 'aluno@exemplo.com', 'senha123', 'aluno');

CALL registrar_ferramenta(1, 'Osciloscópio', 'Usado para visualizar sinais elétricos.');
CALL registrar_ferramenta(2, 'Fonte de Alimentação', 'Usado para alimentar circuitos.');
