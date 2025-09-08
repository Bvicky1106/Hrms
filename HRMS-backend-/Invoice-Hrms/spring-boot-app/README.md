# Spring Boot Application

This is a Spring Boot application designed to demonstrate the use of Docker for containerization.

## Project Structure

```
spring-boot-app
├── src
│   └── main
│       ├── java
│       │   └── com
│       │       └── example
│       │           └── Application.java
│       └── resources
│           └── application.properties
├── Dockerfile
├── docker-compose.yml
├── pom.xml
└── README.md
```

## Prerequisites

- Java 11 or higher
- Maven
- Docker
- Docker Compose

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd spring-boot-app
   ```

2. **Build the application:**

   Use Maven to build the application:

   ```bash
   mvn clean install
   ```

3. **Build the Docker image:**

   Run the following command to build the Docker image:

   ```bash
   docker build -t invoice-hrms:1.0 .
   ```

4. **Run the application using Docker Compose:**

   Start the application and its dependencies with:

   ```bash
   docker-compose up
   ```

## Usage

Once the application is running, you can access it at `http://localhost:8080`.

## Configuration

The application configuration can be found in `src/main/resources/application.properties`. You can modify the database connection settings and other properties as needed.

## License

This project is licensed under the MIT License. See the LICENSE file for details.