/**
 *  departure-arrival-list.ts - list structures in memory
 */

import { IDepartureArrivalList } from "../types/departure-arrival-list";
import { IDeparture } from "../types/departure.types";
import { IArrival } from "../types/arrival.types";
const { InternalApplicationError } = require("../errors/errors");

import { Mutex } from "async-mutex";
import { ErrorTable } from "../errors/errors-table";

export class DepartureArrivalList implements IDepartureArrivalList {
  _departure: IDeparture[];
  _arrival: IArrival[];

  private static instance: DepartureArrivalList;
  private mutex: Mutex;
  static errorTable: ErrorTable = ErrorTable.getInstance();

  static LIMIT_TRIED = 3;

  // ----------------

  constructor(departure: IDeparture[], arrival: IArrival[]) {
    this._departure = departure;
    this._arrival = arrival;
    this.mutex = new Mutex();
  }

  // ----------------

  get departure() {
    return this._departure;
  }

  set departure(value) {
    this._departure = value;
  }

  get arrival() {
    return this._arrival;
  }

  set arrival(value) {
    this._arrival = value;
  }

  // ----------------

  public async removeElementInDepartureList(ID: string) {
    const release = await this.mutex.acquire();
    try {
      await this.safeOperation(async () => {
        this.departure = this.departure.filter(
          (departure) => departure.code !== ID
        );
      });
    } finally {
      release();
    }
  }

  // ----------------

  public async addElementInDepartureList(element: IDeparture): Promise<void> {
    const release = await this.mutex.acquire();
    try {
      await this.safeOperation(async () => {
        this.departure.push(element);
      });
    } finally {
      release();
    }
  }

  // ----------------

  public async existDeparture(code: string): Promise<boolean> {
    const release = await this.mutex.acquire();
    try {
      return await this.safeOperation<boolean>(async (): Promise<boolean> => {
        const found = this.departure.find((element) => element.code === code);
        return found !== undefined;
      });
    } finally {
      release();
    }
  }

  // ----------------

  public async replaceElementInDepartureList(
    ID: string,
    element: IDeparture
  ): Promise<void> {
    const release = await this.mutex.acquire();
    try {
      await this.safeOperation(async () => {
        const indice = this.departure.findIndex(
          (elemento) => elemento.code === ID
        );
        if (indice !== -1) {
          this.departure.splice(indice, 1, element);
        }
      });
    } finally {
      release();
    }
  }

  // ----------------

  public async removeElementInArrivalList(ID: string) {
    const release = await this.mutex.acquire();
    try {
      await this.safeOperation(async () => {
        this.arrival = this.arrival.filter((arrival) => arrival.code !== ID);
      });
    } finally {
      release();
    }
  }

  // ----------------

  public async addElementInArrivalList(element: IArrival): Promise<void> {
    const release = await this.mutex.acquire();
    try {
      await this.safeOperation(async () => {
        this.arrival.push(element);
      });
    } finally {
      release();
    }
  }

  // ----------------

  public async replaceElementInArrivalList(
    ID: string,
    element: IArrival
  ): Promise<void> {
    const release = await this.mutex.acquire();
    try {
      await this.safeOperation(async () => {
        const indice = this.arrival.findIndex(
          (elemento) => elemento.code === ID
        );
        if (indice !== -1) {
          this.arrival.splice(indice, 1, element);
        }
      });
    } finally {
      release();
    }
  }

  /* ----------------------  */

  public async existArrival(code: string): Promise<boolean> {
    const release = await this.mutex.acquire();
    try {
      return await this.safeOperation<boolean>(async (): Promise<boolean> => {
        const found = this.arrival.find((element) => element.code === code);
        return found !== undefined;
      });
    } finally {
      release();
    }
  }

  /* ----------------------  */

  async safeOperation<T>(operacion: () => Promise<T>): Promise<T> {
    let tried = DepartureArrivalList.LIMIT_TRIED;
    while (tried > 0) {
      try {
        return await operacion();
      } catch (error) {
        // Handle possible deadlock or retry error
        console.error("Error when performing safe operation:", error);
        tried--;
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait a short time before retrying
      }
    }
    throw new Error(
      "Failed to complete secure operation after multiple attempts."
    );
  }

  /* ----------------------  */

  public static getInstance(
    departure?: IDeparture[],
    arrival?: IArrival[]
  ): DepartureArrivalList {
    let codeErr: string = "";

    if (!DepartureArrivalList.instance) {
      console.log("Save in memory departure / arrival list");
      if (departure !== undefined && arrival !== undefined)
        DepartureArrivalList.instance = new DepartureArrivalList(
          departure,
          arrival
        );
      else
        throw new InternalApplicationError({
          message:
            DepartureArrivalList.errorTable.getErrorMessages("SYS_002")
              .clientMessage,
          statusCode: "SYS_002",
        });
    } else {
      console.log("Recover from memory departure / arrival list.");
    }
    return DepartureArrivalList.instance;
  }

  /* ----------------------  */

  public static existInstance(): boolean {
    let result = false;
    if (DepartureArrivalList.instance) {
      result = true;
    }
    return result;
  }
}
