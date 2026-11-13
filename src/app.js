const express = require("express");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(express.json());
app.use("/api/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "Request body must contain valid JSON." });
  }
  console.error(error);
  return res.status(500).json({ error: "An unexpected server error occurred." });
});

module.exports = app;
