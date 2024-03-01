// terminal-activation.ui.rs.ts 
// --------------------------------------------------------------

import { ITerminalActivationUiRs } from "../types/terminal-activation.ui.rs.types";

export class TerminalActivationUiRs implements ITerminalActivationUiRs {
    codigoError: string;
    mensajeError: string;

    constructor( codigoError: string, mensajeError: string) {
       this.codigoError = codigoError;
       this.mensajeError = mensajeError;
    }
}

/* ------------------------------- */
