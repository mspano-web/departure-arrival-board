/**
 * notification.controller.ts - HTTP request processing
 */

import { Request, Response, NextFunction } from "express";
const DepartureArrivalService = require("../services/departures-arrivals.services");
const { StandardError, InternalApplicationError } = require("../errors/errors");

import * as axios from "axios";
import { IArrival } from "../types/arrival.types";
import { IEvent } from "../types/event.types";
import { IDeparture } from "../types/departure.types";
import { Departure } from "../data-class/departure";
import { Arrival } from "../data-class/arrival";
import { CommunicationManager } from "../communication/socket";
const communicationManager = require("../communication/socket");
import { ErrorTable } from "../errors/errors-table";

/* ----------------------------------------------------------------- */

export const notification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  const errorTable = ErrorTable.getInstance();
  let codeErr: string = "";
  

  console.log("-----------------------------------------");
  console.log("Notification - req.body(", req.body, ")");
  let dataDetail: IDeparture | IArrival;
  try {
    const eventData: IEvent = req.body;

    if (!eventData.type) {
      codeErr = "PAR_001";
      throw new StandardError({
        message: errorTable.getErrorMessages(codeErr).clientMessage,
        statusCode: codeErr,
      });
    }
    if (!eventData.code) {
       codeErr = "PAR_002";
      throw new StandardError({
        message: errorTable.getErrorMessages(codeErr).clientMessage,
        statusCode: codeErr,
      });
    }
    if (!eventData.location) {
       codeErr = "PAR_003";
      throw new StandardError({
        message: errorTable.getErrorMessages(codeErr).clientMessage,
        statusCode: codeErr,
      });
    }
    if (!eventData.point) {
       codeErr = "PAR_004";
      throw new StandardError({
        message: errorTable.getErrorMessages(codeErr).clientMessage,
        statusCode: codeErr,
      });
    }
    if (!eventData.status) {
      codeErr = "PAR_005";
      throw new StandardError({
        message: errorTable.getErrorMessages(codeErr).clientMessage,
        statusCode: codeErr,
      });
    }
    if (!eventData.time) {
      codeErr = "PAR_006";
      throw new StandardError({
        message: errorTable.getErrorMessages(codeErr).clientMessage,
        statusCode: codeErr,
      });
    }

    if (eventData.type === "departure") {
      dataDetail = new Departure(
        eventData.code,
        eventData.time,
        eventData.point,
        eventData.location,
        eventData.status,
      ) as IDeparture;
    } else {
      if (eventData.type === "arrival") {
        dataDetail = new Arrival(
          eventData.code,
          eventData.time,
          eventData.point,
          eventData.location,
          eventData.status,
        ) as IArrival;
      } else {
        codeErr = "PAR_007";
        throw new StandardError({
          message: errorTable.getErrorMessages(codeErr).clientMessage,
          statusCode: codeErr,
        });
      }
    }

    const resNotify = await DepartureArrivalService.notifyEvent(dataDetail, eventData.type);

    const cm: CommunicationManager = communicationManager.getInstance();
    const connections: Map<string, any> = cm.getAllConnection()
    connections.forEach((connectionElem) => {
      console.log("Notify - UI :", connectionElem.id );
      connectionElem.emit("updated-list", JSON.stringify(resNotify));
    });
    
    return res.status(200).json({ estado: "Ok" }); 
  } catch (e: any) {
    if (e instanceof StandardError || e instanceof InternalApplicationError) {
      const statusCode: string = e._iError.statusCode;
      const message: string = e._iError.message;
      const httpCode: number =
        e instanceof StandardError
          ? axios.HttpStatusCode.BadRequest
          : axios.HttpStatusCode.InternalServerError;
      res
        .status(httpCode)
        .json({ codigoError: statusCode, mensajeError: message });
    } else {
      next(e);
    }
  }
};

/* ----------------------------------------------------------------- */
