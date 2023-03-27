import express from "express";
import cookieParser from "cookie-parser";
import loggingFunction from "./middlewares/logging.middleware";
import corsMiddleware from "./middlewares/cors.middleware";
import * as dotenv from "dotenv";
import compression from "compression";

import indexRouter from "./routes/index";
import departmentOfAgricultureRouter from "./routes/department-of-agriculture.router";
import departmentOfEnergyRouter from "./routes/department-of-energy.router";
import userRouter from "./routes/user.router";
import bookmarksRouter from "./routes/bookmarks.router";
import internationalCoffeeOrganizationRouter from "./routes/international-coffee-organization.router";

require("./services/auth.service");

dotenv.config();
const app = express();

app.use(corsMiddleware());
app.use(compression());
app.use(loggingFunction());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/bookmarks", bookmarksRouter);
app.use("/department-of-agriculture", departmentOfAgricultureRouter);
app.use("/department-of-energy", departmentOfEnergyRouter);
app.use(
  "/international-coffee-organization",
  internationalCoffeeOrganizationRouter
);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send(err?.stack || "Something broke!");
  }
);

export default app;
