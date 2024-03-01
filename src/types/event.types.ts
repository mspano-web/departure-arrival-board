// event.types.ts 
// --------------------------------------------------------------

export interface IEvent  {
    type: string;  // event type (Arrival or Departure)
    code: string;  // ID 
    time: string;  // arrival time 
    point: string; // origin / destination description
    location: string;  // gate, platform
    status: string; // on-time, delayed, cancelled, arrived, etc.
}