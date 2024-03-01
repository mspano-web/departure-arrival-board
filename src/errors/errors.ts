/**
 *  errors.ts - class used for standard errors of the application.
 */

import { IStandardError, IInternalApplicationError } from "../types/errors.types";

export class StandardError extends Error {
  private _iError: IStandardError = {
    name: "",
    route: "",
    params: {},
    exception: "",
    message: "",
    statusCode: "0",
    dateTime: new Date().toLocaleString(),
  };

  constructor(iError: any) {
    super();
    this._iError.name = this.constructor.name;
    this._iError.route = iError.route;
    this._iError.params = iError.params;
    this._iError.exception = iError.exception;
    this._iError.statusCode = iError.statusCode || "400";
    this._iError.message = iError.message;

    // Keeps a proper stack trace for where our bug was thrown (only available in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StandardError);
    }
  }
}

// -----------------------------

export class InternalApplicationError extends Error {
  private _iError: IInternalApplicationError = {
    name: "",
    exception: "",
    message: "",
    statusCode: "500",
    dateTime: new Date().toLocaleString(),
    data: {},
  };

  constructor(iError: any) {
    super();
    this._iError.name = this.constructor.name;
    this._iError.exception = iError.exception;
    this._iError.message = iError.message;
    this._iError.data = iError.data;
    this._iError.statusCode = iError.statusCode;
  }
}

// -----------------------------

module.exports = {
  InternalApplicationError,
  StandardError,
};

// ----------------------------------------------------------------------
