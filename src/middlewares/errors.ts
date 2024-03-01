/**
 * errors.ts - global error processing not processed by services
 */

import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
const { InternalApplicationError, StandardError } = require("../errors/errors");
import { App } from "../app";
import * as axios from "axios";

/* ---------------------------------------------------------- */

const errorLogger: ErrorRequestHandler = (
  e: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!e) return next();
  if (e instanceof InternalApplicationError) {
    App.logger.log({
      level: "error",
      message: JSON.stringify(e._iError) + "\n Stack -> " + e.stack,
    });
  } else {
    if (e instanceof StandardError) {
      App.logger.log({ level: "warn", message: e });
    } else {
      App.logger.log({ level: "warn", message: e });
    }
  }
  next(e);
};

/* ---------------------------------------------------------- */

const errorResponder: ErrorRequestHandler = (
  e: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!e) return next();
  res.header("Content-Type", "application/json");
  let statusCode: string;
  let message: string;
  if (e instanceof InternalApplicationError) {
//    statusCode = e._iError.statusCode.toString();
    statusCode = e._iError.statusCode;
    message = e._iError.message;
  } else {
    statusCode = "7";
    message = "terminal manager presents problems";
  }
  console.log("statusCode:", statusCode)
  console.log("message:", message)
  res
    .status(axios.HttpStatusCode.InternalServerError)
    .json({ codigoError: statusCode, mensajeError: message });
};

/* ---------------------------------------------------------- */

module.exports = { errorLogger, errorResponder };
