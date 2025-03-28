CREATE DATABASE curso_eletro;

USE curso_eletro;

CREATE TABLE ferramentas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    estado ENUM('em_reparo', 'ocupado', 'disponível') NOT NULL
);

CREATE TABLE Admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nivel ENUM('coordenacao', 'professor', 'aluno') NOT NULL
);

CREATE TABLE Ferramentas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Admin_Ferramentas (
    admin_id INT,
    ferramenta_id INT,
    PRIMARY KEY (admin_id, ferramenta_id),
    FOREIGN KEY (admin_id) REFERENCES Admins(id),
    FOREIGN KEY (ferramenta_id) REFERENCES Ferramentas(id)
);

INSERT INTO Admins (nome, email, senha, nivel) VALUES 
('Admin Exemplo', 'admin@exemplo.com', 'senhaSegura123', 'coordenacao'),
('Admin Coordenador', 'coordenador@exemplo.com', 'senhaCoordenador123', 'coordenacao'),
('Admin Professor', 'professor@exemplo.com', 'senhaProfessor123', 'professor'),
('Admin Aluno', 'aluno@exemplo.com', 'senhaAluno123', 'aluno');

INSERT INTO Ferramentas (nome, descricao) VALUES 
('Ferramenta A', 'Descrição da Ferramenta A'),
('Ferramenta B', 'Descrição da Ferramenta B');

INSERT INTO Admin_Ferramentas (admin_id, ferramenta_id) VALUES 
(1, 1),
(1, 2);

-- Sistema para registrar e remover ferramentas
DELIMITER //

CREATE PROCEDURE registrar_ferramenta(IN admin_id INT, IN nome VARCHAR(100), IN descricao TEXT)
BEGIN
    DECLARE nivel_admin ENUM('coordenacao', 'professor', 'aluno');
    
    SELECT nivel INTO nivel_admin FROM Admins WHERE id = admin_id;
    
    IF nivel_admin IN ('coordenacao', 'professor') THEN
        INSERT INTO Ferramentas (nome, descricao) VALUES (nome, descricao);
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Acesso negado: apenas coordenadores e professores podem registrar ferramentas.';
    END IF;
END //

CREATE PROCEDURE remover_ferramenta(IN admin_id INT, IN ferramenta_id INT)
BEGIN
    DECLARE nivel_admin ENUM('coordenacao', 'professor', 'aluno');
    
    SELECT nivel INTO nivel_admin FROM Admins WHERE id = admin_id;
    
    IF nivel_admin = 'coordenacao' THEN
        DELETE FROM Ferramentas WHERE id = ferramenta_id;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Acesso negado: apenas coordenadores podem remover ferramentas.';
    END IF;
END //

DELIMITER ;
