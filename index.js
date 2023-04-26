import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/MongoDb.js";
import ImportData from "./DataImport.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRouter from "./Routes/userRouter.js";
import agricultureRouter from "./Routes/agricultureRouter.js";
import agricultureTypeRouter from "./Routes/agricultureTypeRouter.js";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

dotenv.config();
connectDatabase();
const app = express();
app.use(express.json());

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: "Agriculture API",
    version: '1.0.0',
    description: 'This is a REST API application made with Express. It retrievews data from JSONPlace!',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'JSONPlaceholder',
      url: 'https://jsonplaceholder.typicode.com',
    },
  },
  servers: [
    {
      url: 'https://agriculture-identity.vercel.app/',
      description: 'Development server agriculture',
    },
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./Routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Content-Length, Authorization, Accept, yourHeaderField"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// API
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/api/v1/import", ImportData);
app.use("/api/v1/agriculture", agricultureRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/agricultureType", agricultureTypeRouter)

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`server run in port ${PORT}`));
