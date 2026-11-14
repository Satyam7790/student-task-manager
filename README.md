# Todo List REST API

A small beginner-friendly REST API built with Node.js and Express. It stores tasks in `src/data/tasks.json` and uses `@aalu127/env-checker-lite` to check application settings before the server starts.

## Features

- Create, list, retrieve, update, and delete tasks.
- Toggle a task between completed and pending.
- Persist tasks in a local JSON file across server restarts.
- Validate `PORT`, `NODE_ENV`, and `MAX_TASKS` at startup.
- Reject invalid task input and enforce the configured task limit.

## Technologies

- Node.js 18 or newer
- Express.js
- `@aalu127/env-checker-lite`
- JSON file storage
  
## Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
cd student-task-manager
```

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env
```

The application uses `dotenv` to automatically load environment variables from `.env` when the server starts.

Start the server:

```bash
npm start
```

The API will be available at `http://localhost:3000` by default.

**Note:** The `.env` file is intentionally excluded from GitHub. Use `.env.example` as a template to create your local configuration.
```

## Start the server

```sh
npm start
```

For automatic restarts during development:

```sh
npm run dev
```

The server prints its local URL when it is ready. The API base URL is `http://localhost:3000` when using the default port.

## API endpoints

All request and response bodies use JSON. Replace `:id` with the task's returned `id`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/tasks` | Get all tasks |
| `GET` | `/api/tasks/:id` | Get one task |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/:id` | Update one or more task fields |
| `PATCH` | `/api/tasks/:id/complete` | Toggle completion status |
| `DELETE` | `/api/tasks/:id` | Delete a task |

### Create a task

```sh
curl -X POST http://localhost:3000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Read a chapter","description":"Read chapter 3"}'
```

Returns `201 Created`:

```json
{
  "id": "generated-uuid",
  "title": "Read a chapter",
  "description": "Read chapter 3",
  "completed": false,
  "createdAt": "2026-01-01T12:00:00.000Z"
}
```

The ID and timestamp above are examples; the server generates both.

### Get all tasks

```sh
curl http://localhost:3000/api/tasks
```

Returns `200 OK` with an array of task objects (or `[]` if there are none).

### Get one task

```sh
curl http://localhost:3000/api/tasks/TASK_ID
```

Returns `200 OK` with the task, or `404 Not Found` if the ID does not exist.

### Update a task

Send one or more fields. `title` must be a non-empty string, `description` a string, and `completed` a boolean.

```sh
curl -X PUT http://localhost:3000/api/tasks/TASK_ID \
  -H 'Content-Type: application/json' \
  -d '{"title":"Read two chapters","completed":true}'
```

Returns `200 OK` with the updated task, `400 Bad Request` for invalid input, or `404 Not Found` for an unknown ID.

### Toggle completion

```sh
curl -X PATCH http://localhost:3000/api/tasks/TASK_ID/complete
```

Returns `200 OK` with the task after its `completed` value has flipped. Call again to switch it back to pending.

### Delete a task

```sh
curl -X DELETE http://localhost:3000/api/tasks/TASK_ID
```

Returns `200 OK` with a deletion message and the deleted task, or `404 Not Found` if the ID does not exist.

Invalid task data and malformed JSON return `400 Bad Request`. Creating a task when `MAX_TASKS` is reached also returns `400` with a task-limit message. Requests for unknown routes return `404`.

## How `@aalu127/env-checker-lite` is integrated

`src/config/env.js` imports the package's documented `validateEnv` and `EnvValidationError` exports. It calls `validateEnv` with a schema for the three settings and their types/defaults. The package reads `process.env`, converts numeric values, and returns a config object. If validation throws `EnvValidationError`, the module prints the package's readable message and exits with status 1. `src/server.js` imports this config before it imports and starts the Express application, so invalid configuration prevents the server from listening. The task controller uses the validated `MAX_TASKS` number.

## Project structure

```text
src/
  config/env.js
  controllers/taskController.js
  routes/taskRoutes.js
  data/tasks.json
  app.js
  server.js
.env.example
.gitignore
package.json
README.md
```
