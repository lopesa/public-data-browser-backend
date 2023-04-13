import express from "express";
import cookieParser from "cookie-parser";
import loggingFunction, {
  winstonLogger,
} from "./middlewares/logging.middleware";
import corsMiddleware from "./middlewares/cors.middleware";
import * as dotenv from "dotenv";
import compression from "compression";
import helmet from "helmet";

import indexRouter from "./routes/index";
import departmentOfAgricultureRouter from "./routes/department-of-agriculture.router";
import departmentOfEnergyRouter from "./routes/department-of-energy.router";
import userRouter from "./routes/user.router";
import bookmarksRouter from "./routes/bookmarks.router";
import internationalCoffeeOrganizationRouter from "./routes/international-coffee-organization.router";
import departmentOfTreasuryRouter from "./routes/department-of-treasury.router";

require("./services/auth.service");

dotenv.config();
const app = express();

app.use(corsMiddleware());
app.use(compression());
app.use(loggingFunction());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/bookmarks", bookmarksRouter);
app.use("/department-of-agriculture", departmentOfAgricultureRouter);
app.use("/department-of-energy", departmentOfEnergyRouter);
app.use("/department-of-treasury", departmentOfTreasuryRouter);
app.use(
  "/international-coffee-organization",
  internationalCoffeeOrganizationRouter
);

// this is essentially the built in Error Logger
// default will not send error stack in prod
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    winstonLogger.log({
      level: "error",
      message: err?.message || "Something broke - server side",
    });
    let response =
      process.env.NODE_ENV === "development" ? err?.stack : undefined;
    response = response || "Something broke! - server side";

    res.status(500).send(response);
  }
);

app.use((req, res, next) => {
  // FELL ALL THE WAY THROUGH!!
  // @TODO: add logging here
  // nothing should fall through to here
  winstonLogger.log({
    level: "error",
    message: "Something broke! - fell all the way through",
  });
  // winstonLogger.log({ level: "error", message: JSON.stringify(req.params) });
  // winstonLogger.log({ level: "error", message: JSON.stringify(req.baseUrl) });
  // winstonLogger.log({ level: "error", message: JSON.stringify(req.body) });
  // winstonLogger.log({ level: "error", message: JSON.stringify(req.hostname) });
  // winstonLogger.log({
  //   level: "error",
  //   message: JSON.stringify(req.originalUrl),
  // });
  // winstonLogger.log({ level: "error", message: JSON.stringify(req.path) });
  // winstonLogger.log({ level: "error", message: JSON.stringify(req.route) });
  res.status(500).send("Something broke! - server side");
});

export default app;
