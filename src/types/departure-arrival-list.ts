// departure-arrival.types.ts 
// --------------------------------------------------------------

import { IDeparture } from "./departure.types";
import { IArrival } from "./arrival.types" ;
import { IDepartureArrivalListData } from "./departure-arrival-list.data";

/* --------------------------------------------------------------------- */

export interface IDepartureArrivalList extends IDepartureArrivalListData
{
    addElementInDepartureList(element: IDeparture): Promise<void>;
    replaceElementInDepartureList(ID: string, element: IDeparture): Promise<void>;
    existDeparture(code: string): Promise<boolean> ;
    addElementInArrivalList(element: IArrival): Promise<void>;
    replaceElementInArrivalList(ID: string, element: IArrival): Promise<void>;
    existArrival(code: string): Promise<boolean> ;
}

/* --------------------------------------------------------------------- */

