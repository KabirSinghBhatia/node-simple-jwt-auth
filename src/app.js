if (process.env.NODE_ENV !== "production") {
  const envFile =
    process.env.NODE_ENV === "test" ? `./config/.env.test` : "./config/.env";
  require("dotenv").config({ path: envFile });
}

const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/user");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();
app.use(express.json());

app.use(userRouter);

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
