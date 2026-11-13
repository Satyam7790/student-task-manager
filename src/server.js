const config = require("./config/env");
const app = require("./app");

app.listen(config.PORT, () => {
  console.log(`Todo API is running at http://localhost:${config.PORT} (${config.NODE_ENV})`);
});
