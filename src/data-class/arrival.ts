// arrival.ts 
// --------------------------------------------------------------

import { IArrival } from "../types/arrival.types";

export class Arrival implements IArrival {
    private _code: string;
    private _time: string;
    private _point: string;
    private _location: string;
    private _status: string;

    constructor(code: string, time: string, point: string, location: string, status: string) {
            this._code = code;
            this._time  = time;
            this._point = point;
            this._location = location;
            this._status = status;
    }

    get code() {
        return this._code;
    }
 
    set code(code) {
        this._code = code;
    }

    get time() {
        return this._time;
    }
 
    set time(value) {
        this._time = value;
    }

    get point() {
        return this._point;
    }
 
    set point(value) {
        this._point = value;
    }

    get location() {
        return this._location;
    }
 
    set location(value) {
        this._location = value;
    }

    get status() {
        return this._status;
    }
 
    set status(value) {
        this._status = value;
    }

    toJSON() {
        return {
          code: this._code,
          time: this._time,
          point: this._point,
          location: this._location,
          status: this._status,
        };
      }
}