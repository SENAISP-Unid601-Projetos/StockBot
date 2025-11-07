# Usa uma imagem base do Java 21 (como no seu pom.xml)
FROM eclipse-temurin:21-jdk-slim

# Copia o .jar do seu projeto para dentro da imagem
COPY target/*.jar app.jar

# Expõe a porta 8080 (a mesma do seu application.properties)
EXPOSE 8080

# Comando para rodar a aplicação
ENTRYPOINT ["java","-jar","/app.jar"]