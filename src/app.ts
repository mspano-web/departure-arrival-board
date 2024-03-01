/**
 * app.ts - Application initialization
 */

import express, { Application } from "express";
const bodyParser = require('body-parser');
import { createServer, Server as HttpServer } from "http";
import { Configuration } from "./config/config";
import { DEV } from "./types/config.types";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import mdRoutes from "./routes/router";
const configuration = require("./config/config");
const winston = require("winston");
const { errorLogger, errorResponder } = require("./middlewares/errors");
import { CommunicationManager } from "./communication/socket";
const communicationManager = require("./communication/socket");

import { Server } from "socket.io";


// ----------------------------------------------------

export class App {
  private app: Application;
  private configuration: Configuration;
  private corsOptions: any;
  private httpServer: HttpServer;
  private _io: Server;

  public static logger: any;

  //------------------

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this._io = new Server(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    this.configuration = configuration.getInstance();
    this.settings();
    this.middlewares();
    this.routes();
    this.communication();
  }

  public get io() {
    return this._io;
  }

  public set io(io) {
    this._io = io;
  }

  
  //------------------

  public getConfiguration() {
    if (!configuration) throw Error("Configuration Fail");
    return configuration;
  }

  //------------------

  public getSocketConnection() {
    if (!this.io) throw Error("Socket Connection Fail");
    return this.io;
  }

  //------------------

  private setCors() {
    this.corsOptions = {
      methods: ["GET", "POST"],
      origin: [this.configuration.iSecurity.cors],
    };
  }

  //------------------

  private setWinston() {
    App.logger = winston.createLogger({
      level: this.configuration.env === DEV ? "debug" : "warn", 
      format: winston.format.json(),
      transports: [
        new winston.transports.File({
          filename: "warning.log",
          level: "warn",
          maxsize: 1000000,
        }),
      ],
    });
    if (this.configuration.env === DEV) {
      const myformat = winston.format.cli({ colors: { info: "blue" } });
      App.logger.add(
        new winston.transports.Console({
          format: myformat,
        })
      );
    }
  }

  //------------------

  private settings() {
    this.app.set("port", this.configuration.iWebServer.port);
    this.setWinston();
    this.setCors();
  }

  //------------------

  private middlewares() {
    App.logger.info({ message: "App - Middleware initialization... " });
    this.app.use(morgan("dev"));
    this.app.use(cors(this.corsOptions));
    this.app.use(express.json());
    this.app.use(bodyParser.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.static(path.join(__dirname, "../public")));
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, Access-Control-Allow-Credentials"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST"
      );
      res.header("Allow", "GET, POST");
      next();
    });
  }

  //------------------

  private routes() {
    App.logger.info({ message: "App - Routes initialization... " });

    this.app.use(mdRoutes);
    this.app.use(errorLogger);
    this.app.use(errorResponder);

    this.app.get("*", function (req, res, next) {
      App.logger.log({ level: "warn", message: "Enpoint not found." });
      res.status(404).json({ status: 404, msg: "Enpoint not found." });
      next();
    });
  }

  //------------------

  private communication() {
    const cm: CommunicationManager = communicationManager.getInstance();
    cm.getConnection(this.io);
  }

  
  //---------------------------------------------------------------------------------



  async listen() {
    try {
      App.logger.info({ message: "App - Listen initialization... " });
      this.httpServer.listen(this.app.get("port"), () => {
        App.logger.info({ message: `Server on port: ${this.app.get("port")}` });
      });
    } catch (e) {
      App.logger.log({ level: "warn", message: "Listen fail!" });
      throw Error("Listen fail");
    }
  }
}

// ----------------------------------------------------
