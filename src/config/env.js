const { validateEnv, EnvValidationError } = require("@aalu127/env-checker-lite");

let config;

try {
  config = validateEnv({
    PORT: { type: "number", default: 3000 },
    NODE_ENV: { type: "string", default: "development" },
    MAX_TASKS: { type: "number", default: 100 },
  });
} catch (error) {
  if (error instanceof EnvValidationError) {
    console.error(error.message);
    process.exit(1);
  }
  throw error;
}

module.exports = config;
