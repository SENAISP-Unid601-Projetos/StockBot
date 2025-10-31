# StockBot

Sistema de estoque que visa **melhorar o desempenho** no setor de almoxarifado.

## Status do Projeto
(Em desenvolvimento)

## 🏁 Pré-requisitos

Antes de começar, você vai precisar ter as seguintes ferramentas instaladas em sua máquina:
* [Node.js](https://nodejs.org/en/) (Recomendamos a versão LTS)
* [JDK](https://www.oracle.com/java/technologies/downloads/) (Ex: Versão 17 ou superior)
* [Maven](https://maven.apache.org/download.cgi) (Para o Back-end)
* [MySQL](https://dev.mysql.com/downloads/mysql/) (O banco de dados)
* Um gerenciador de pacotes (NPM ou Yarn).
* Um navegador web (Chrome, Firefox, etc.).

## 🛠️ Tecnologias Usadas

Este projeto é dividido em duas partes principais (front-end e back-end):

* **Front-end (Web):**
    * **React.js** (Possivelmente com [Vite](https://vitejs.dev/))
    * JavaScript (ou TypeScript)
* **Back-end (API):**
    * Java
    * Spring Boot (Para a criação da API REST)
* **Banco de Dados:**
    * MySQL


## 🚀 Instalação e Execução

Siga os passos abaixo para rodar o projeto em seu ambiente de desenvolvimento.

### 1. Back-end (API de Java/Spring)

Primeiro, vamos configurar e rodar o servidor que cuida dos dados.

```bash
# 1. Navegue até a pasta do back-end (ajuste o nome se for diferente)
cd pasta-do-backend

# 2. Configure seu banco de dados
# (Você precisará criar um arquivo 'application.properties' ou 'application.yml' 
# em 'src/main/resources' com suas credenciais do MySQL)

# 3. Compile e instale as dependências com o Maven
mvn clean install

# 4. Execute o projeto Spring Boot
# (Você pode fazer isso pela sua IDE - IntelliJ - ou via comando)
java -jar target/nome-do-seu-arquivo.jar

---------------------------Front-end------------------------------------------

# 1. Clone o repositório (se ainda não o fez)
git clone <URL_DO_SEU_REPOSITORIO>

# 2. Entre na pasta do front-end
cd StockBot 

# 3. Instale as dependências
npm install

# 4. Execute o servidor de desenvolvimento
npm run dev

----------------------------------------------

-- 1. Abra o seu cliente MySQL.
-- e crie o schema (banco) que o Spring irá usar.
-- Exemplo:
CREATE DATABASE stockbot;
USE stockbot;






