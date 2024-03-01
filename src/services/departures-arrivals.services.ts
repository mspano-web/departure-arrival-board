/**
 * departure-arrival.services.ts - Departure & Arrival processing service
 */

import * as axios from "axios";
import { IMMS_Server } from "../types/config.types";
const Configuration = require("../config/config");
import { DepartureArrivalListData } from "../data-class/departure-arrival-list-data";
import { IDepartureArrivalList } from "../types/departure-arrival-list";
import { DepartureArrivalList } from "../memory/departure-arrival-list";
import { InternalApplicationError, StandardError } from "../errors/errors";
import { IDeparture } from "../types/departure.types";
import { IArrival } from "../types/arrival.types";
import { Departure } from "../data-class/departure";
import { Arrival } from "../data-class/arrival";
import { IDepartureArrivalListData } from "../types/departure-arrival-list.data";
import { ErrorTable } from "../errors/errors-table";

/* ------------------------------------------------------------ */

export const getDeparturesArrivals = async function (): Promise<
  IDepartureArrivalListData | undefined
> {
  const errorTable = ErrorTable.getInstance();
  let codeErr: string = "";
  try {
    let departureArrivalList: IDepartureArrivalListData | undefined = undefined;

    console.log("getDeparturesArrivals");

    const iMSS_Server: IMMS_Server = Configuration.getInstance().iMSS_Server;
    if (iMSS_Server === null) {
      codeErr = "SYS_003";
      throw new InternalApplicationError({
        message: errorTable.getErrorMessages(codeErr).clientMessage,
        statusCode: codeErr,
      });
    }

    if (!DepartureArrivalList.existInstance()) {
      departureArrivalList = (
        await axios.default.get<IDepartureArrivalList>(
          `${iMSS_Server.protocol}://${iMSS_Server.host}:${iMSS_Server.port}/departures-arrivals`
        )
      ).data;

      if (departureArrivalList === null) {
        codeErr = "APP_002";
        throw new StandardError({
          message: errorTable.getErrorMessages(codeErr).clientMessage,
          statusCode: codeErr,
        });
      }
      
    }

    const mDAL: DepartureArrivalList = DepartureArrivalList.getInstance(
      departureArrivalList && departureArrivalList.departure !== undefined
        ? departureArrivalList.departure
        : undefined,
      departureArrivalList && departureArrivalList.arrival
        ? departureArrivalList.arrival
        : undefined
    );
    if (mDAL === null) {
      codeErr = "SYS_004";
      throw new InternalApplicationError({
        message: errorTable.getErrorMessages(codeErr).clientMessage,
        statusCode: codeErr,
      });
    }
    if (!departureArrivalList) {
      departureArrivalList = new DepartureArrivalListData(
        mDAL.departure,
        mDAL.arrival
      );
    }
    
    return departureArrivalList;
  } catch (e: any | axios.AxiosError) {
    console.log("ERROR getDeparturesArrivals e: ", e);
    if (e instanceof InternalApplicationError || e instanceof StandardError) {
      throw e;
    } else {
      if (e instanceof axios.AxiosError) {
        if (e.code === "ECONNREFUSED") {
          codeErr = "SYS_006";
          throw new InternalApplicationError({
            message: errorTable.getErrorMessages(codeErr).clientMessage,
            statusCode: codeErr,
          });
        } else {
          if (e.code === "ERR_BAD_REQUEST") {
            throw new InternalApplicationError({
              message: e.response?.data.mensajeError,
              statusCode: e.response?.data.codigoError,
            });
          } else {
            codeErr = "SYS_005";
            throw new InternalApplicationError({
              message: errorTable.getErrorMessages(codeErr).clientMessage,
              statusCode: codeErr,
            });
          }
        }
      } else {
        codeErr = "SYS_005";
        throw new InternalApplicationError({
          message: errorTable.getErrorMessages(codeErr).clientMessage,
          statusCode: codeErr,
        });
      }
    }
  }
};

/* --------------------------------------------------------------- */

export const notifyEvent = async function (
  dataDetail: IDeparture | IArrival,
  type: string
): Promise<IDepartureArrivalListData | undefined> {
  const errorTable = ErrorTable.getInstance();
  let codeErr: string = "";

  try {
    const mDAL: IDepartureArrivalList = DepartureArrivalList.getInstance();
    if (mDAL === null) {
      console.log("Fallo en memoria");
      codeErr = "SYS_004";
      throw new InternalApplicationError({
        message: errorTable.getErrorMessages(codeErr).clientMessage,
        statusCode: codeErr,
      });
    }

    if (!dataDetail) {
      console.log("Fallo en dataDetails");
      codeErr = "PAR_010";
      throw new InternalApplicationError({
        message: errorTable.getErrorMessages(codeErr).clientMessage,
        statusCode: codeErr,
      });
    }

    if (type === "departure") {
      const departureValue = new Departure(
        dataDetail.code,
        dataDetail.time,
        dataDetail.point,
        dataDetail.location,
        dataDetail.status
      );
      if (await mDAL.existDeparture(dataDetail.code)) {
        console.log("Replace departure");
        await mDAL.replaceElementInDepartureList(
          dataDetail.code,
          departureValue
        );
      } else {
        console.log("New departure");
        await mDAL.addElementInDepartureList(departureValue);
      }
    } else { 
      const arrivalValue = new Arrival(
        dataDetail.code,
        dataDetail.time,
        dataDetail.point,
        dataDetail.location,
        dataDetail.status
      );
      if (type === "arrival") {
        if (await mDAL.existArrival(dataDetail.code)) {
          console.log("Replace arrival");
          await mDAL.replaceElementInArrivalList(
            dataDetail.code,
            arrivalValue
          );
        } else {
          console.log("New arrival");
          await mDAL.addElementInArrivalList(arrivalValue);
        }
      } else {
        codeErr = "PAR_011";
        throw new StandardError({
          message: errorTable.getErrorMessages(codeErr).clientMessage,
          statusCode: codeErr,
        });
      }
    }
    return new DepartureArrivalListData(mDAL.departure, mDAL.arrival).toJSON();
  } catch (e) {
    if (e instanceof InternalApplicationError || e instanceof StandardError) {
      throw e;
    } else {
      codeErr = "SYS_004";
      throw new InternalApplicationError({
        message: errorTable.getErrorMessages(codeErr).clientMessage,
        statusCode: codeErr,
      });
    }
  }
};

/* --------------------------------------------------- */
