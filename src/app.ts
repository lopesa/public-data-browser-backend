import express from "express";
import cookieParser from "cookie-parser";
import loggingFunction from "./middlewares/logging.middleware";
import corsMiddleware from "./middlewares/cors.middleware";
import * as dotenv from "dotenv";

import indexRouter from "./routes/index";
import departmentOfAgricultureRouter from "./routes/department-of-agriculture";

dotenv.config();
const app = express();

app.use(corsMiddleware());
app.use(loggingFunction());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/department-of-agriculture", departmentOfAgricultureRouter);

export default app;
