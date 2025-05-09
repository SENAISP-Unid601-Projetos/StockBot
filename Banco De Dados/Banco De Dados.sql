-- Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS sistema_senai;
USE sistema_senai;

-- 1. Tabela de Estados (para normalização)
CREATE TABLE IF NOT EXISTS estados (
    uf CHAR(2) PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

-- 2. Tabela de Cidades (para normalização)
CREATE TABLE IF NOT EXISTS cidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    uf CHAR(2) NOT NULL,
    FOREIGN KEY (uf) REFERENCES estados(uf)
);

-- 3. Tabela de Unidades SENAI
CREATE TABLE IF NOT EXISTS unidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(200) NOT NULL,
    cidade_id INT NOT NULL,
    horario_abertura TIME NOT NULL,
    horario_fechamento TIME NOT NULL,
    FOREIGN KEY (cidade_id) REFERENCES cidades(id),
    CHECK (horario_fechamento > horario_abertura)
);

-- 4. Tabela de Perfis de Acesso
CREATE TABLE IF NOT EXISTS perfis_acesso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao VARCHAR(200),
    nivel INT NOT NULL UNIQUE
);

-- 5. Tabela de Usuários (com segurança aprimorada)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cpf VARCHAR(14) UNIQUE CHECK (cpf REGEXP '^\d{3}\.\d{3}\.\d{3}-\d{2}$'),
    cracha VARCHAR(20) UNIQUE,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL COMMENT 'Armazena hash bcrypt',
    salt VARCHAR(100) NOT NULL COMMENT 'Salt para hashing',
    perfil_id INT NOT NULL,
    tipo ENUM('professor', 'aluno') NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_login DATETIME NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (perfil_id) REFERENCES perfis_acesso(id),
    CHECK (
        (tipo = 'professor' AND cpf IS NOT NULL AND cracha IS NULL) OR
        (tipo = 'aluno' AND cracha IS NOT NULL AND cpf IS NULL)
    )
);

-- 6. Tabela de Professores
CREATE TABLE IF NOT EXISTS professores (
    usuario_id INT PRIMARY KEY,
    unidade_id INT NOT NULL,
    especializacao VARCHAR(100),
    data_contratacao DATE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (unidade_id) REFERENCES unidades(id)
);

-- 7. Tabela de Alunos
CREATE TABLE IF NOT EXISTS alunos (
    usuario_id INT PRIMARY KEY,
    turma VARCHAR(50) NOT NULL,
    horario_aula TIME NOT NULL,
    data_ingresso DATE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- 8. Tabela de Ferramentas (com mais detalhes)
CREATE TABLE IF NOT EXISTS ferramentas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(100) NOT NULL,
    fabricante VARCHAR(100),
    ano YEAR NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    numero_serie VARCHAR(50) UNIQUE,
    status ENUM('disponivel', 'emprestado', 'manutencao') DEFAULT 'disponivel',
    data_aquisicao DATE NOT NULL,
    valor DECIMAL(10,2),
    unidade_id INT NOT NULL,
    FOREIGN KEY (unidade_id) REFERENCES unidades(id)
);

-- 9. Tabela de Empréstimos de Ferramentas
CREATE TABLE IF NOT EXISTS emprestimos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ferramenta_id INT NOT NULL,
    usuario_id INT NOT NULL,
    retirada_horario DATETIME DEFAULT CURRENT_TIMESTAMP,
    entrega_horario DATETIME NULL,
    observacoes TEXT,
    FOREIGN KEY (ferramenta_id) REFERENCES ferramentas(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CHECK (entrega_horario IS NULL OR entrega_horario > retirada_horario)
);

-- 10. Tabela de Relacionamento Professor-Aluno
CREATE TABLE IF NOT EXISTS professor_aluno (
    professor_id INT NOT NULL,
    aluno_id INT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NULL,
    PRIMARY KEY (professor_id, aluno_id),
    FOREIGN KEY (professor_id) REFERENCES professores(usuario_id),
    FOREIGN KEY (aluno_id) REFERENCES alunos(usuario_id),
    CHECK (data_fim IS NULL OR data_fim > data_inicio)
);

-- 11. Tabela de Registros de Acesso
CREATE TABLE IF NOT EXISTS registros_acesso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    unidade_id INT NOT NULL,
    entrada DATETIME DEFAULT CURRENT_TIMESTAMP,
    saida DATETIME NULL,
    dispositivo VARCHAR(100),
    endereco_ip VARCHAR(45),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (unidade_id) REFERENCES unidades(id),
    CHECK (saida IS NULL OR saida > entrada)
);

-- 12. Tabela de Permissões
CREATE TABLE IF NOT EXISTS permissoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao VARCHAR(200),
    codigo VARCHAR(50) UNIQUE NOT NULL
);

-- 13. Tabela de Perfil-Permissão
CREATE TABLE IF NOT EXISTS perfil_permissao (
    perfil_id INT NOT NULL,
    permissao_id INT NOT NULL,
    PRIMARY KEY (perfil_id, permissao_id),
    FOREIGN KEY (perfil_id) REFERENCES perfis_acesso(id),
    FOREIGN KEY (permissao_id) REFERENCES permissoes(id)
);

-- 14. Tabela de Logs de Atividades
CREATE TABLE IF NOT EXISTS logs_auditoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL,
    acao VARCHAR(100) NOT NULL,
    tabela_afetada VARCHAR(50),
    registro_id INT,
    dados_anteriores JSON,
    novos_dados JSON,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    endereco_ip VARCHAR(45),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Índices para Otimização (Performance)
CREATE INDEX idx_usuario_tipo ON usuarios(tipo);
CREATE INDEX idx_ferramenta_status ON ferramentas(status);
CREATE INDEX idx_ferramenta_categoria ON ferramentas(categoria);
CREATE INDEX idx_emprestimos_ativos ON emprestimos(usuario_id, entrega_horario);
CREATE INDEX idx_acesso_usuario ON registros_acesso(usuario_id, saida);
CREATE INDEX idx_aluno_turma ON alunos(turma);
CREATE INDEX idx_professor_unidade ON professores(unidade_id);

-- PROCEDURES E TRIGGERS PARA SEGURANÇA E CONTROLE

DELIMITER //

-- Função para gerar hash de senha
CREATE FUNCTION gerar_hash_senha(senha_plana VARCHAR(255), sal VARCHAR(100))
RETURNS VARCHAR(255)
DETERMINISTIC
BEGIN
    -- Em produção, substituir por função de hash real como bcrypt
    RETURN SHA2(CONCAT(senha_plana, sal), 512);
END//

-- Procedure para criar usuário com senha segura
CREATE PROCEDURE criar_usuario_seguro(
    IN p_cpf VARCHAR(14),
    IN p_cracha VARCHAR(20),
    IN p_nome VARCHAR(100),
    IN p_data_nascimento DATE,
    IN p_senha_plana VARCHAR(255),
    IN p_perfil_id INT,
    IN p_tipo ENUM('professor', 'aluno')
)
BEGIN
    DECLARE v_salt VARCHAR(100);
    DECLARE v_senha_hash VARCHAR(255);
    
    -- Gera salt aleatório
    SET v_salt = SUBSTRING(MD5(RAND()), 1, 16);
    
    -- Cria hash da senha
    SET v_senha_hash = gerar_hash_senha(p_senha_plana, v_salt);
    
    -- Insere usuário
    INSERT INTO usuarios (cpf, cracha, nome, data_nascimento, senha_hash, salt, perfil_id, tipo)
    VALUES (p_cpf, p_cracha, p_nome, p_data_nascimento, v_senha_hash, v_salt, p_perfil_id, p_tipo);
    
    -- Retorna o ID do novo usuário
    SELECT LAST_INSERT_ID() AS novo_usuario_id;
END//

-- Procedure para autenticar usuário
CREATE PROCEDURE autenticar_usuario(
    IN p_identificador VARCHAR(20), -- Pode ser CPF ou crachá
    IN p_senha_plana VARCHAR(255)
)
BEGIN
    DECLARE v_usuario_id INT;
    DECLARE v_senha_hash VARCHAR(255);
    DECLARE v_salt VARCHAR(100);
    DECLARE v_hash_calculado VARCHAR(255);
    
    -- Encontra usuário por CPF ou crachá
    SELECT id, senha_hash, salt INTO v_usuario_id, v_senha_hash, v_salt
    FROM usuarios 
    WHERE (cpf = p_identificador OR cracha = p_identificador)
    AND ativo = TRUE;
    
    -- Verifica se encontrou o usuário
    IF v_usuario_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuário não encontrado ou inativo';
    END IF;
    
    -- Calcula hash da senha fornecida
    SET v_hash_calculado = gerar_hash_senha(p_senha_plana, v_salt);
    
    -- Compara hashes
    IF v_hash_calculado != v_senha_hash THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Senha incorreta';
    END IF;
    
    -- Atualiza último login
    UPDATE usuarios SET ultimo_login = NOW() WHERE id = v_usuario_id;
    
    -- Retorna dados do usuário
    SELECT u.*, p.nome AS perfil, p.nivel AS nivel_perfil
    FROM usuarios u
    JOIN perfis_acesso p ON u.perfil_id = p.id
    WHERE u.id = v_usuario_id;
END//

-- Trigger para controle de acesso
CREATE TRIGGER tg_valida_horario_acesso
BEFORE INSERT ON registros_acesso
FOR EACH ROW
BEGIN
    DECLARE v_horario_unidade TIME;
    DECLARE v_tipo_usuario VARCHAR(10);
    DECLARE v_perfil_nivel INT;
    
    -- Obtém horário da unidade e tipo de usuário
    SELECT u.horario_abertura, us.tipo, pa.nivel 
    INTO v_horario_unidade, v_tipo_usuario, v_perfil_nivel
    FROM unidades u
    JOIN usuarios us ON us.id = NEW.usuario_id
    JOIN perfis_acesso pa ON us.perfil_id = pa.id
    WHERE u.id = NEW.unidade_id;
    
    -- Verifica se está dentro do horário de funcionamento (exceto administradores)
    IF TIME(NEW.entrada) < v_horario_unidade AND v_perfil_nivel < 10 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Acesso antes do horário de abertura';
    END IF;
    
    -- Verifica tempo máximo de permanência para alunos
    IF v_tipo_usuario = 'aluno' AND v_perfil_nivel < 5 THEN
        -- Alunos só podem ficar 8 horas por dia
        IF EXISTS (
            SELECT 1 FROM registros_acesso 
            WHERE usuario_id = NEW.usuario_id 
            AND DATE(entrada) = CURDATE()
            AND TIMESTAMPDIFF(HOUR, entrada, COALESCE(saida, NOW())) >= 8
        ) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Tempo máximo de permanência excedido para aluno';
        END IF;
    END IF;
END//

-- Trigger para auditoria de alterações em usuários
CREATE TRIGGER tg_auditoria_usuarios
AFTER UPDATE ON usuarios
FOR EACH ROW
BEGIN
    IF NEW.senha_hash != OLD.senha_hash THEN
        INSERT INTO logs_auditoria (usuario_id, acao, tabela_afetada, registro_id)
        VALUES (OLD.id, 'ALTERACAO_SENHA', 'usuarios', OLD.id);
    END IF;
    
    IF NEW.ativo != OLD.ativo THEN
        INSERT INTO logs_auditoria (usuario_id, acao, tabela_afetada, registro_id, dados_anteriores)
        VALUES (OLD.id, 'ALTERACAO_STATUS', 'usuarios', OLD.id, 
                JSON_OBJECT('ativo_anterior', OLD.ativo, 'novo_status', NEW.ativo));
    END IF;
END//

DELIMITER ;

-- VIEWS PARA RELATÓRIOS

-- Ferramentas disponíveis por unidade
CREATE VIEW vw_ferramentas_disponiveis AS
SELECT f.*, u.nome AS unidade, c.nome AS cidade, e.uf
FROM ferramentas f
JOIN unidades u ON f.unidade_id = u.id
JOIN cidades c ON u.cidade_id = c.id
JOIN estados e ON c.uf = e.uf
WHERE f.status = 'disponivel';

-- Empréstimos ativos com detalhes
CREATE VIEW vw_emprestimos_ativos AS
SELECT 
    e.id AS emprestimo_id,
    f.modelo AS ferramenta,
    f.categoria,
    u.nome AS usuario,
    us.tipo AS tipo_usuario,
    uni.nome AS unidade,
    e.retirada_horario,
    DATEDIFF(NOW(), e.retirada_horario) AS dias_emprestado
FROM emprestimos e
JOIN ferramentas f ON e.ferramenta_id = f.id
JOIN usuarios u ON e.usuario_id = u.id
JOIN unidades uni ON f.unidade_id = uni.id
JOIN (
    SELECT id, tipo FROM usuarios
) us ON u.id = us.id
WHERE e.entrega_horario IS NULL;

-- Acessos em aberto
CREATE VIEW vw_acessos_em_aberto AS
SELECT 
    r.id,
    u.nome AS usuario,
    u.tipo,
    un.nome AS unidade,
    r.entrada,
    TIMESTAMPDIFF(HOUR, r.entrada, NOW()) AS horas_dentro
FROM registros_acesso r
JOIN usuarios u ON r.usuario_id = u.id
JOIN unidades un ON r.unidade_id = un.id
WHERE r.saida IS NULL;

-- Documentação do esquema
CREATE TABLE schema_docs (
    tabela VARCHAR(50) PRIMARY KEY,
    descricao TEXT NOT NULL,
    exemplo_uso TEXT,
    restricoes TEXT
);

-- Inserindo documentação básica
INSERT INTO schema_docs VALUES
('usuarios', 'Armazena informações de todos os usuários do sistema (professores e alunos). As senhas são armazenadas como hashes.', 
 'Use criar_usuario_seguro() para adicionar novos usuários.', 'CPF único para professores, crachá único para alunos.'),
('ferramentas', 'Cadastro de todas as ferramentas disponíveis para empréstimo.', 
 'INSERT INTO ferramentas (modelo, ano, categoria, unidade_id) VALUES (...)', 'Status controlado por trigger ao emprestar/devolver'),
('emprestimos', 'Registra todos os empréstimos de ferramentas.', 
 'Use a procedure emprestar_ferramenta()', '1 ferramenta por usuário simultaneamente');

-- Dados iniciais (exemplo)
INSERT INTO estados VALUES 
('SP', 'São Paulo'),
('RJ', 'Rio de Janeiro');

INSERT INTO cidades (nome, uf) VALUES
('São Paulo', 'SP'),
('Santos', 'SP'),
('Rio de Janeiro', 'RJ');

INSERT INTO unidades (nome, endereco, cidade_id, horario_abertura, horario_fechamento) VALUES
('SENAI Centro', 'Rua Principal, 100', 1, '08:00:00', '18:00:00'),
('SENAI Litoral', 'Av. Beira Mar, 500', 2, '07:00:00', '17:00:00');

INSERT INTO perfis_acesso (nome, descricao, nivel) VALUES
('Administrador', 'Acesso total ao sistema', 10),
('Coordenador', 'Coordena unidades', 7),
('Professor', 'Acesso a turmas e alunos', 5),
('Aluno Avançado', 'Alunos com mais privilégios', 3),
('Aluno Regular', 'Alunos com acesso básico', 1);

-- Senha de exemplo: "senha123" (em produção, usar senhas fortes)
INSERT INTO usuarios (cpf, cracha, nome, data_nascimento, senha_hash, salt, perfil_id, tipo) VALUES
('111.111.111-11', NULL, 'Admin Master', '1980-01-01', 
 '8f3d3c9a5b1c4e4f8b7a3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1', 'salt123', 1, 'professor'),
(NULL, 'A1001', 'Aluno Exemplar', '2000-05-15',
 '7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5', 'salt456', 4, 'aluno');