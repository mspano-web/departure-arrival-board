import { IArrival } from "./arrival.types";
import { IDeparture } from "./departure.types";

export interface IDepartureArrivalListData {
    departure: IDeparture[];
    arrival: IArrival[];
}