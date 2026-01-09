FROM maven:3.9.9-eclipse-temurin-21-jammy
WORKDIR /app
COPY . .
RUN mvn clean install -DskipTests


FROM openjdk:21-jdk-slim
WORKDIR /app

COPY --from=0 app/target/hospital-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]


