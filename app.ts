import express from "express";
// import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import * as dotenv from "dotenv";
import cors from "cors";

import indexRouter from "./routes/index";
import departmentOfAgricultureRouter from "./routes/department-of-agriculture";

dotenv.config();
const app = express();

const allowedOrigins = ["http://localhost:3000"];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use("/", indexRouter);
app.use("/department-of-agriculture", departmentOfAgricultureRouter);

export default app;
