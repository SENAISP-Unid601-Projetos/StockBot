# --- Estágio 1: Build (Construção) ---
# Usamos uma imagem que já tem Maven e o JDK 21
FROM maven:3.9-eclipse-temurin-21 AS build

# Define o diretório de trabalho dentro da imagem
WORKDIR /app

# Copia os arquivos de configuração do Maven e o pom
COPY .mvn/ .mvn
COPY mvnw .
COPY pom.xml .

# Copia o código-fonte
COPY src src

# Executa o comando para "empacotar" a aplicação (criar o .jar)
# -DskipTests pula os testes para um build mais rápido no deploy
RUN ./mvnw clean package -DskipTests

# --- Estágio 2: Run (Execução) ---
# Usamos a imagem "alpine" que é leve, só com o Java 21
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copia APENAS o .jar que foi gerado no Estágio 1
# O *.jar pega o nome do seu arquivo (BackEnd_Refatore-0.0.1-SNAPSHOT.jar)
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta 8080
EXPOSE 8080

# Comando para rodar a aplicação
ENTRYPOINT ["java","-jar","/app.jar"]