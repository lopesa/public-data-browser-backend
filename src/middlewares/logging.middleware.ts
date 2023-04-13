import express from "express";
import logger from "morgan";
import fs from "fs";
import path from "path";

import { createLogger, format, transports } from "winston";

const { combine, timestamp, prettyPrint, colorize, errors } = format;

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

const winstonEnumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

export const winstonLogger = createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: combine(
    errors({ stack: true }),
    winstonEnumerateErrorFormat(),
    process.env.NODE_ENV === "development"
      ? format.colorize()
      : format.uncolorize(),
    format.splat(),
    format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new transports.Console({
      stderrLevels: ["error"],
    }),
    new transports.File({ filename: "combined.log" }),
  ],
});

export default loggingFunction;
