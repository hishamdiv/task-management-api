# Task Management API

## Overview
A modern, containerized REST API for task management, built as a Cloud Computing & Containerization final project.

## Architecture
- **Reverse Proxy**: Nginx
- **API**: Node.js + Express
- **Database**: PostgreSQL
- **Orchestration**: Docker Compose

## Startup
To start the entire multi-container system:
```bash
docker compose up -d
```

## API Endpoints
- `GET /api/tasks` - Retrieve all tasks
- `GET /api/tasks/:id` - Retrieve a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Versioning
- `v1.0.0`
- `latest`
