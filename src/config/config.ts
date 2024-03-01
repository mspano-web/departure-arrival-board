/**
 *  config.ts : This file contains application properties.
 */

import { IWebServer, DEV, IMMS_Server, ISecurity } from "../types/config.types";
const { InternalError } = require("../errors/errors");

let instance: Configuration | null = null;

export class Configuration {
  private _iWebServer: IWebServer = { port: "", host: "" };
  // ManagementSystemServer (MSS)
  private _iMSS_Server: IMMS_Server = { protocol: "", host: "", port: "" };
  private _iSecurity: ISecurity = { cors: "" };
  private _env: string = "";
  private dotenvParsed: any;


  // -----------------

  constructor() {
    this._env = process.env.NODE_ENV || DEV;
    if (this._env === DEV) {
      this.getEnvironmentDev();
    }
    this.setWebServer();
    this.setManagementSystemServer();
  }

  // -----------------

  private getEnvironmentDev() {
    const dotenv = require("dotenv");
    const result = dotenv.config();
    if (result.error) {
      throw new InternalError({
        message: "Configuration - Gen Environment Dev Fail",
        data: { error: result.error },
      });
    }
    const { parsed } = result;
    this.dotenvParsed = parsed;
  }

  // ---------------------------------

  public get iWebServer() {
    return this._iWebServer;
  }

  public set iWebServer(oWebServer) {
    this._iWebServer = oWebServer;
  }

  public get iMSS_Server() {
    return this._iMSS_Server;
  }

  public set iMSS_Server(oMSS_Server) {
    this._iMSS_Server = oMSS_Server;
  }

  public get iSecurity() {
    return this._iSecurity;
  }

  public set iSecurity(oSecurity) {
    this._iSecurity = oSecurity;
  }

  public get env() {
    return this._env;
  }

  public set env(oEnv) {
    this._env = oEnv;
  }

  // -----------------

  setWebServer() {
    this.iWebServer = {
      port: this.env === "DEV" ? this.dotenvParsed.PORT : process.env.PORT,
      host:
        this.env === "DEV"
          ? this.dotenvParsed.NODE_HOST
          : process.env.NODE_HOST,
    };
    if (!this.iWebServer.port || !this.iWebServer.host) {
      throw new InternalError({
        message: "Configuration - WebServer Fail",
        data: { webserver: this.iWebServer },
      });
    }
  }

  // -----------------

  setManagementSystemServer() {
    this.iMSS_Server = {
      protocol:
        this.env === "DEV"
          ? this.dotenvParsed.MSS_PROTOCOL
          : process.env.MSS_PROTOCOL,
      host:
        this.env === "DEV" ? this.dotenvParsed.MSS_HOST : process.env.MSS_HOST,
      port:
        this.env === "DEV" ? this.dotenvParsed.MSS_PORT : process.env.MSS_PORT,
    };
    if (
      !this.iMSS_Server.port ||
      !this.iMSS_Server.host ||
      !this.iMSS_Server.protocol
    ) {
      throw new InternalError({
        message: "Configuration - Management System Server Fail",
        data: { mss_server: this.iMSS_Server },
      });
    }
  }


  // -----------------

  setSecurity() {
    this.iSecurity = {
      cors: this.env === "DEV" ? this.dotenvParsed.CORS : process.env.CORS,
    };
    if (!this.iSecurity.cors) {
      throw new InternalError({
        message: "Configuration - Security Fail",
        data: { security: this.iSecurity },
      });
    }
  }

  // -----------------

  
  public static getInstance(): Configuration {
    if (!instance) {
      instance = new Configuration();
    }
    return instance;
  }
}

// --------------------------------------------------------------

module.exports = Configuration;

// --------------------------------------------------------------
