# GuarantyMetalUI Project

This project is designed to run a React frontend, a Node.js API, and a PostgreSQL database, all containerized with Docker for seamless development, testing, and deployment experiences.

## Project Structure

- **Frontend**: React application for the user interface.
- **API**: Node.js backend for business logic.
- **DB**: PostgreSQL for persistent data storage.

## Getting Started

These instructions will help you get the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following tools installed:
- Docker
- Docker Compose

### Setup

1. **Clone the Repository**

    ```bash
    git clone <repository-url>
    ```

2. **Navigate to Project Directory**

    ```bash
    cd <project-directory>
    ```

3. **Launch Docker Containers**

    ```bash
    docker-compose up --build
    ```

This command starts up all the necessary services:
- `db`: A PostgreSQL database.
- `api`: A Node.js-based backend.
- `frontend`: A React-based frontend.

### Access Points

- **Frontend**: [http://localhost:3001](http://localhost:3001) - React application.
- **API**: [http://localhost:3000](http://localhost:3000) - Backend API.

## Docker Services

### Database (PostgreSQL)

- **Image**: `postgres:latest`
- **Environment Variables**: Configures the database name, user, and password.
- **Volumes**: Persists database data and initializes the database with SQL scripts.

### API (Node.js)

- **Build Context**: `./api`
- **Environment Variables**: Contains database connection settings.
- **Dependencies**: Waits for the `db` service to be ready.

### Frontend (React)

- **Build Context**: `./FrontEnd/guarantymetalui`
- **Volumes**: Enables live reloading for development.
- **Environment**: Set to `development`.
- **Dependencies**: Waits for the `api` service.

## Persistent Volume

- **mydbdata**: Stores PostgreSQL data across container lifecycles.

## Development Workflow

- Live reloading is enabled for the frontend. Any changes in the `./FrontEnd/guarantymetalui` directory will be reflected immediately.
- The API server automatically restarts upon changes, facilitated by Nodemon.

## Built With

- [React](https://reactjs.org/) - Frontend framework.
- [Node.js](https://nodejs.org/) - Backend runtime.
- [PostgreSQL](https://www.postgresql.org/) - Database system.
- [Docker](https://www.docker.com/) - Containerization platform.

## Authors

- **Jacob Carney**
- **Waleed Kambal**
- **Mason Wittkofski**
- **Brandon Bejarano**
- **Michal Zajac**
