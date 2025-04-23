# Stage 1 - Build with Maven
FROM amazoncorretto:21-alpine AS builder
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:go-offline
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Stage 2 - Run the WAR
FROM amazoncorretto:21-alpine
WORKDIR /app
COPY --from=builder /app/target/student-0.0.1-SNAPSHOT.war app.war
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.war"]
