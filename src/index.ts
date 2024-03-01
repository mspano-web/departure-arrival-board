/**
 * index.ts: application entry point
 *           Web server creation with NodeJS and express configuration
 */

import { App } from "./app";
const { InternalApplicationError } = require("./errors/errors");

/* ---------------------------------------------- */

async function main() {
  let app: App | undefined = undefined;
  try {
    app = new App();
    await app.listen();
  } catch (e: any) {
    if (e instanceof InternalApplicationError) {
      if (app) {
        App.logger.error({
          status: e._iError.statusCode,
          message: e._iError.message,
        });
      } else {
        console.log("Initialization failed : ", e._iError.message);
      }
    } else {
      if (app) {
        App.logger.error("Uncaught exception : (", e, ")");
      } else {
        console.log("Initialization failed exception(", e, ")");
      }
    }
  }
}

/* ---------------------------------------------- */

main();

/* ------------------------------------------------------------------------ */
