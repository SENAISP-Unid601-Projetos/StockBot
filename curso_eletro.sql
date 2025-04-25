create database material_curso;
USE material_curso;

-- 1️ Remove a constraint existente (se necessário)
ALTER TABLE Professores DROP CHECK professores_chk_1;

-- 2️ Recria a tabela sem a constraint CHECK
DROP TABLE IF EXISTS Professores;
CREATE TABLE Professores (
    usuario_id INT PRIMARY KEY,
    cpf CHAR(11) UNIQUE NOT NULL,
    titulacao VARCHAR(50),
    area_especializacao VARCHAR(100),
    data_nascimento DATE,  -- Removido o CHECK aqui
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE,
    INDEX idx_professor_area (area_especializacao)
);

-- 3️ Cria triggers para validação
DELIMITER //
CREATE TRIGGER before_professor_insert
BEFORE INSERT ON Professores
FOR EACH ROW
BEGIN
    IF NEW.data_nascimento >= CURDATE() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Data de nascimento deve ser anterior à data atual';
    END IF;
END //

CREATE TRIGGER before_professor_update
BEFORE UPDATE ON Professores
FOR EACH ROW
BEGIN
    IF NEW.data_nascimento >= CURDATE() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Data de nascimento deve ser anterior à data atual';
    END IF;
END //
DELIMITER ; 


==============================

-- --------------------------------------------------
-- Banco Aluno (Dados Acadêmicos)
-- --------------------------------------------------
CREATE DATABASE IF NOT EXISTS Aluno;
USE Aluno;

-- Tabela de Cursos
DROP TABLE IF EXISTS Cursos;
CREATE TABLE Cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL CHECK (codigo REGEXP '^[A-Z]{3}-\\d{3}$'),
    nome VARCHAR(100) NOT NULL,
    carga_horaria INT NOT NULL CHECK (carga_horaria BETWEEN 100 AND 5000),
    data_inicio DATE NOT NULL,
    data_termino DATE NULL CHECK (data_termino IS NULL OR data_termino > data_inicio),
    INDEX idx_curso_data (data_inicio)
);

-- Tabela de Alunos (Estendida)
DROP TABLE IF EXISTS Alunos;
CREATE TABLE Alunos (
    usuario_id INT PRIMARY KEY,
    matricula VARCHAR(20) UNIQUE NOT NULL,
    data_ingresso DATE NOT NULL,
    data_evasao DATE NULL,
    FOREIGN KEY (usuario_id) REFERENCES material_curso.Usuarios(id),
    INDEX idx_aluno_ingresso (data_ingresso)
);

-- Tabela de Matrículas
DROP TABLE IF EXISTS Matriculas;
CREATE TABLE Matriculas (
    aluno_id INT NOT NULL,
    curso_id INT NOT NULL,
    data_matricula DATE NOT NULL,
    status ENUM('ativo', 'trancado', 'concluido') DEFAULT 'ativo',
    PRIMARY KEY (aluno_id, curso_id),
    FOREIGN KEY (aluno_id) REFERENCES Alunos(usuario_id),
    FOREIGN KEY (curso_id) REFERENCES Cursos(id),
    INDEX idx_matricula_status (status)
);

-- Tabela de Professor-Curso
DROP TABLE IF EXISTS Professor_Cursos;
CREATE TABLE Professor_Cursos (
    professor_id INT NOT NULL,
    curso_id INT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NULL,
    FOREIGN KEY (professor_id) REFERENCES material_curso.Professores(usuario_id),
    FOREIGN KEY (curso_id) REFERENCES Cursos(id),
    PRIMARY KEY (professor_id, curso_id),
    INDEX idx_professor_curso (curso_id)
);

-- --------------------------------------------------
-- Procedures Acadêmicas
-- --------------------------------------------------

DELIMITER //
-- Matricular Aluno
CREATE PROCEDURE matricular_aluno(
    IN p_email VARCHAR(100),
    IN p_codigo_curso VARCHAR(10))
BEGIN
    DECLARE v_aluno_id, v_curso_id INT;

    SELECT id INTO v_curso_id FROM Cursos 
    WHERE codigo = p_codigo_curso;

    IF v_curso_id IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Curso não encontrado';
    END IF;

    SELECT usuario_id INTO v_aluno_id FROM material_curso.Usuarios u
    JOIN Alunos a ON u.id = a.usuario_id
    WHERE u.email = p_email AND u.tipo = 'aluno';

    IF v_aluno_id IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Aluno não encontrado';
    END IF;

    INSERT INTO Matriculas (aluno_id, curso_id, data_matricula)
    VALUES (v_aluno_id, v_curso_id, CURDATE());
END //

-- Atualizar Status de Matrícula
CREATE PROCEDURE atualizar_matricula(
    IN p_email VARCHAR(100),
    IN p_codigo_curso VARCHAR(10),
    IN p_novo_status ENUM('ativo', 'trancado', 'concluido'))
BEGIN
    DECLARE v_aluno_id, v_curso_id INT;

    -- Obter IDs
    SELECT id INTO v_curso_id FROM Cursos 
    WHERE codigo = p_codigo_curso;

    SELECT usuario_id INTO v_aluno_id FROM material_curso.Usuarios u
    JOIN Alunos a ON u.id = a.usuario_id
    WHERE u.email = p_email AND u.tipo = 'aluno';

    -- Atualizar
    UPDATE Matriculas 
    SET status = p_novo_status,
        data_matricula = CASE 
            WHEN p_novo_status = 'concluido' THEN CURDATE()
            ELSE data_matricula
        END
    WHERE aluno_id = v_aluno_id 
    AND curso_id = v_curso_id;
END //

DELIMITER ;
