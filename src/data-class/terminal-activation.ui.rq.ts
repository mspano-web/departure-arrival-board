// terminal-activation.ui.rq.ts 
// --------------------------------------------------------------

import { ITerminalActivationUiRq } from "../types/terminal-activation.ui.rq.types";

export class TerminalActivationUiRq implements ITerminalActivationUiRq {
    private _terminal: number;

    constructor(terminal: number) {
       this._terminal = terminal;
    }

     get terminal() {
        return this._terminal;
      }
 
      set terminal(value) {
        this._terminal = value;
      }
}

/* ------------------------------- */
