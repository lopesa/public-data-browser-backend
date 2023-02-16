import express from "express";
import logger from "morgan";
import fs from "fs";
import path from "path";

const loggingFunction = (
  req?: express.Request,
  res?: express.Response,
  next?: express.NextFunction
) => {
  var accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    { flags: "a" }
  );

  return logger("dev", { stream: accessLogStream });
};

// app.use(logger("dev"));

export default loggingFunction;
