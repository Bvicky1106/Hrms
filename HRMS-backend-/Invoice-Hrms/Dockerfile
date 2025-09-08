# Use OpenJDK 21 slim image
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy the JAR file (use Linux-style paths)
COPY target/Invoice-Hrms-0.0.1-SNAPSHOT.jar app.jar

# Expose Spring Boot port
EXPOSE 8080

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
