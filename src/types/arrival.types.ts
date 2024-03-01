// arrival.types.ts 
// --------------------------------------------------------------

export interface IArrival  {
    code: string;  // ID 
    time: string;  // arrival time 
    point: string; // origin description
    location: string;  // gate, platform
    status: string; // on-time, delayed, cancelled, arrived
}