if (process.env.NODE_ENV !== "production") {
  const envFile =
    process.env.NODE_ENV === "test" ? `./config/.env.test` : "./config/.env";
  require("dotenv").config({ path: envFile });
}

const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/user");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();
app.use(express.json());

app.use(userRouter);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Skynox Task API",
      description:
        "An API built with Express and MongoDB. This API provides a secure user registration and login system which can persist the login state in the backend itself.",
    },
  },
  components: {
    securitySchemes: {
      jwt: {
        type: "http",
        scheme: "bearer",
        in: "header",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      jwt: [],
    },
  ],
  apis: ["./src/routers/user.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
