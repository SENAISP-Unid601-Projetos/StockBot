-- Criação dos bancos
CREATE DATABASE IF NOT EXISTS material_curso;
CREATE DATABASE IF NOT EXISTS Aluno;

-- Uso do banco principal
USE material_curso;

-- Tabela de Usuários (assumida como necessária para chaves estrangeiras)
DROP TABLE IF EXISTS Usuarios;
CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    tipo ENUM('aluno', 'professor') NOT NULL
);

-- Tabela de Professores
DROP TABLE IF EXISTS Professores;
CREATE TABLE Professores (
    usuario_id INT PRIMARY KEY,
    cpf CHAR(11) UNIQUE NOT NULL,
    titulacao VARCHAR(50),
    area_especializacao VARCHAR(100),
    data_nascimento DATE,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE,
    INDEX idx_professor_area (area_especializacao)
);

-- Triggers de validação para data de nascimento
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

-- Uso do banco Aluno
USE Aluno;

-- Tabela de Cursos
DROP TABLE IF EXISTS Cursos;
CREATE TABLE Cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL CHECK (codigo REGEXP '^[A-Z]{3}-\\d{3}$'),
    nome VARCHAR(100) NOT NULL,
    carga_horaria INT NOT NULL CHECK (carga_horaria BETWEEN 100 AND 5000),
    data_inicio DATE NOT NULL,
    data_termino DATE NULL,
    INDEX idx_curso_data (data_inicio)
);

-- Triggers para validação de datas em Cursos
DELIMITER //
CREATE TRIGGER check_datas_curso_insert
BEFORE INSERT ON Cursos
FOR EACH ROW
BEGIN
    IF NEW.data_termino IS NOT NULL AND NEW.data_termino <= NEW.data_inicio THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Data de término deve ser posterior à data de início';
    END IF;
END //

CREATE TRIGGER check_datas_curso_update
BEFORE UPDATE ON Cursos
FOR EACH ROW
BEGIN
    IF NEW.data_termino IS NOT NULL AND NEW.data_termino <= NEW.data_inicio THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Data de término deve ser posterior à data de início';
    END IF;
END //
DELIMITER ;

-- Tabela de Alunos
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
-- Procedures Operacionais
-- --------------------------------------------------

DELIMITER //
CREATE PROCEDURE matricular_aluno(
    IN p_email VARCHAR(100),
    IN p_codigo_curso VARCHAR(10))
BEGIN
    DECLARE v_aluno_id, v_curso_id INT;

    SELECT id INTO v_curso_id FROM Cursos WHERE codigo = p_codigo_curso LIMIT 1;
    IF v_curso_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Curso não encontrado';
    END IF;

    SELECT usuario_id INTO v_aluno_id FROM material_curso.Usuarios u
    JOIN Alunos a ON u.id = a.usuario_id
    WHERE u.email = p_email AND u.tipo = 'aluno' LIMIT 1;
    IF v_aluno_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Aluno não encontrado';
    END IF;

    IF EXISTS (SELECT 1 FROM Matriculas WHERE aluno_id = v_aluno_id AND curso_id = v_curso_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Aluno já está matriculado neste curso';
    END IF;

    INSERT INTO Matriculas (aluno_id, curso_id, data_matricula)
    VALUES (v_aluno_id, v_curso_id, CURDATE());
END //

CREATE PROCEDURE atualizar_matricula(
    IN p_email VARCHAR(100),
    IN p_codigo_curso VARCHAR(10),
    IN p_novo_status VARCHAR(20))
BEGIN
    DECLARE v_aluno_id, v_curso_id INT;

    IF p_novo_status NOT IN ('ativo', 'trancado', 'concluido') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Status de matrícula inválido';
    END IF;

    SELECT id INTO v_curso_id FROM Cursos WHERE codigo = p_codigo_curso LIMIT 1;
    SELECT usuario_id INTO v_aluno_id FROM material_curso.Usuarios u
    JOIN Alunos a ON u.id = a.usuario_id
    WHERE u.email = p_email AND u.tipo = 'aluno' LIMIT 1;

    UPDATE Matriculas 
    SET status = p_novo_status,
        data_matricula = CASE WHEN p_novo_status = 'concluido' THEN CURDATE() ELSE data_matricula END
    WHERE aluno_id = v_aluno_id AND curso_id = v_curso_id;
END //

-- --------------------------------------------------
-- Procedures de Relatórios
-- --------------------------------------------------

CREATE PROCEDURE listar_alunos_por_curso(IN p_codigo_curso VARCHAR(10))
BEGIN
    SELECT a.usuario_id, u.nome, m.status
    FROM Matriculas m
    JOIN Alunos a ON m.aluno_id = a.usuario_id
    JOIN material_curso.Usuarios u ON a.usuario_id = u.id
    JOIN Cursos c ON c.id = m.curso_id
    WHERE c.codigo = p_codigo_curso;
END //

CREATE PROCEDURE listar_professores_por_curso()
BEGIN
    SELECT c.nome AS curso, u.nome AS professor, pc.data_inicio, pc.data_fim
    FROM Professor_Cursos pc
    JOIN Cursos c ON c.id = pc.curso_id
    JOIN material_curso.Professores p ON pc.professor_id = p.usuario_id
    JOIN material_curso.Usuarios u ON u.id = p.usuario_id;
END //

DELIMITER ;
