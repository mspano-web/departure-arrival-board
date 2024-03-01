import { IArrival } from "../types/arrival.types";
import { IDepartureArrivalListData } from "../types/departure-arrival-list.data";
import { IDeparture } from "../types/departure.types";

export class DepartureArrivalListData implements IDepartureArrivalListData {
  private _departure: IDeparture[];
  private _arrival: IArrival[];

  constructor(departure: IDeparture[], arrival: IArrival[]) {
    this._departure = departure;
    this._arrival = arrival;
  }

  get departure() {
    return this._departure;
  }

  set departure(departure) {
    this._departure = departure;
  }

  get arrival() {
    return this._arrival;
  }

  set arrival(arrival) {
    this._arrival = arrival;
  }

  toJSON() {
    return { departure: this._departure, arrival: this._arrival }; 
  }
}
