const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const { MAX_TASKS } = require("../config/env");

const tasksFile = path.join(__dirname, "..", "data", "tasks.json");

function readTasks() {
  try {
    const contents = fs.readFileSync(tasksFile, "utf8");
    const tasks = JSON.parse(contents);
    if (!Array.isArray(tasks)) throw new Error("Task data must be a JSON array.");
    return tasks;
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error("Task data file contains invalid JSON.");
    throw error;
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(tasksFile, `${JSON.stringify(tasks, null, 2)}\n`);
}

function getAllTasks(req, res, next) {
  try {
    res.json(readTasks());
  } catch (error) {
    next(error);
  }
}

function getTaskById(req, res, next) {
  try {
    const task = readTasks().find((item) => item.id === req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found." });
    return res.json(task);
  } catch (error) {
    return next(error);
  }
}

function createTask(req, res, next) {
  try {
    const { title, description = "" } = req.body || {};
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Title is required and must be a non-empty string." });
    }
    if (typeof description !== "string") {
      return res.status(400).json({ error: "Description must be a string." });
    }

    const tasks = readTasks();
    if (tasks.length >= MAX_TASKS) {
      return res.status(400).json({ error: `Task limit reached. MAX_TASKS is ${MAX_TASKS}.` });
    }

    const task = {
      id: randomUUID(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    saveTasks(tasks);
    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
}

function updateTask(req, res, next) {
  try {
    const { title, description, completed } = req.body || {};
    if (title === undefined && description === undefined && completed === undefined) {
      return res.status(400).json({ error: "Provide at least one field to update." });
    }
    if (title !== undefined && (typeof title !== "string" || !title.trim())) {
      return res.status(400).json({ error: "Title must be a non-empty string." });
    }
    if (description !== undefined && typeof description !== "string") {
      return res.status(400).json({ error: "Description must be a string." });
    }
    if (completed !== undefined && typeof completed !== "boolean") {
      return res.status(400).json({ error: "Completed must be a boolean." });
    }

    const tasks = readTasks();
    const task = tasks.find((item) => item.id === req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found." });
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (completed !== undefined) task.completed = completed;
    saveTasks(tasks);
    return res.json(task);
  } catch (error) {
    return next(error);
  }
}

function toggleCompletion(req, res, next) {
  try {
    const tasks = readTasks();
    const task = tasks.find((item) => item.id === req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found." });
    task.completed = !task.completed;
    saveTasks(tasks);
    return res.json(task);
  } catch (error) {
    return next(error);
  }
}

function deleteTask(req, res, next) {
  try {
    const tasks = readTasks();
    const index = tasks.findIndex((item) => item.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Task not found." });
    const [deletedTask] = tasks.splice(index, 1);
    saveTasks(tasks);
    return res.json({ message: "Task deleted.", task: deletedTask });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, toggleCompletion, deleteTask };
