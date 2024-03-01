/**
 * socket.ts : real time processing
 */

const { InternalApplicationError, StandardError } = require("../errors/errors");
import { Server } from "socket.io";
import { ITerminalActivationUiRs } from "../types/terminal-activation.ui.rs.types";
import { ITerminalActivationUiRq } from "../types/terminal-activation.ui.rq.types";
import { TerminalActivationUiRs } from "../data-class/terminal-activation.ui.rs";
import { getDeparturesArrivals } from "../services/departures-arrivals.services";
const memoryDAL = require("../memory/departure-arrival-list");
import { ErrorTable } from "../errors/errors-table";
import { IDepartureArrivalListData } from "../types/departure-arrival-list.data";

let instance: CommunicationManager | null = null;

/* --------------------------------- */

export class CommunicationManager {
  public _socketMap: Map<string, any>;

  static errorTable: ErrorTable = ErrorTable.getInstance();

  constructor() {
    this._socketMap = new Map<string, any>();
  }

  // --------------------

  get socketMap() {
    return this._socketMap;
  }

  // --------------------

  set socketMap(value) {
    this._socketMap = value;
  }

  // --------------------

  public getConnection(io: Server): boolean {
    let codeErr: string = "";

    if (!io) return false;
    io.on("connection", (socket: any) => {
      console.log("Socket Connected ID:", socket.id);
      let IDMap: string = "";

      /* ------------------------------- */

      socket.on("terminal-activation", async (iD: ITerminalActivationUiRq) => {
        console.log("terminal-activation iD:", iD);
        if (!iD) {
          codeErr = "PAR_008";
          const terminalActivationUiRs: ITerminalActivationUiRs =
            new TerminalActivationUiRs(
              codeErr,
              CommunicationManager.errorTable.getErrorMessages(
                codeErr
              ).clientMessage
            );
          socket.emit(
            "terminal-activation",
            JSON.stringify(terminalActivationUiRs)
          );
          return false;
        }
        if (!iD.terminal) {
          codeErr = "PAR_009";
          const terminalActivationUiRs: ITerminalActivationUiRs =
            new TerminalActivationUiRs(
              codeErr,
              CommunicationManager.errorTable.getErrorMessages(
                codeErr
              ).clientMessage
            );
          socket.emit(
            "terminal-activation",
            JSON.stringify(terminalActivationUiRs)
          );
          return false;
        }

        IDMap = `${iD.terminal}`;

        if (this.socketMap.has(IDMap)) {
          codeErr = "APP_001";
          const terminalActivationUiRs: ITerminalActivationUiRs =
            new TerminalActivationUiRs(
              codeErr,
              CommunicationManager.errorTable.getErrorMessages(
                codeErr
              ).clientMessage
            );
          socket.emit(
            "terminal-activation",
            JSON.stringify(terminalActivationUiRs)
          );

          return;
        }
        try {
          const data: IDepartureArrivalListData | undefined =
            await getDeparturesArrivals();
          if (data) {
            socket.emit("terminal-activation", JSON.stringify(data));
          }
          this.socketMap.set(IDMap, socket);
          // this.dumpSocketsList(); // Only for debug
        } catch (e: any) {
          console.log("EXCEPCION terminal-activation e:", e);
          let terminaActivaUiRs: ITerminalActivationUiRs;
          if (
            e instanceof InternalApplicationError ||
            e instanceof StandardError
          ) {
            terminaActivaUiRs = new TerminalActivationUiRs(
              e._iError.statusCode,
              e._iError.message
            );
          } else {
            codeErr = "SYS_001";
            terminaActivaUiRs = new TerminalActivationUiRs(
              codeErr,
              CommunicationManager.errorTable.getErrorMessages(
                codeErr
              ).clientMessage
            );
          }
          socket.emit("terminal-activation", JSON.stringify(terminaActivaUiRs));
          return false;
        }

        //--------------------

        socket.on("disconnect",   () => {
          console.log("SOCKET - LIST DISCONNECT -> ID: " + IDMap);
          this.socketMap.delete(IDMap);
        });
      });

      /* ------------------------------- */
    });
    return true;
  }

  /* ---------------------------------------------------- */

  public async dumpSocketsList(): Promise<void> {
    console.log("DUMP SocketList (DEBUG)");
    this.socketMap.forEach((value: any, key: string) => {
      console.log("CLV:", key);
      console.log("CONTENT (", value.id, ")");
    });
  }

  /* ---------------------------------------------------- */

  public getAllConnection(): Map<string, any> {
    return this.socketMap;
  }

  /* ---------------------------------------------------- */

  public getAllConnectionWithFilter(IDList: string): Map<string, any> {
    let keys: string[] = [];
    let _resMap: Map<string, any> = new Map();

    for (const key of this.socketMap.keys()) {
      if (key.startsWith(IDList)) {
        keys.push(key);
      }
    }
    keys.forEach((key) => {
      _resMap.set(key, this.socketMap.get(key));
    });
    return _resMap;
  }

  /* ---------------------------------------------------- */

  public static getInstance(): CommunicationManager {

    if (!instance) {
      console.log("Create CommunicationManager");
      instance = new CommunicationManager();
    } else {
      console.log("Recover Instance CommunicationManager");
    }

    return instance;
  }
}

/* --------------------------------- */

module.exports = CommunicationManager;
