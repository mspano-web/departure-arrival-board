// departure.types.ts 
// --------------------------------------------------------------

export interface IDeparture {
    code: string;  // ID 
    time: string;  // dearture time 
    point: string; // destination description
    location: string;  // gate, platform
    status: string; // on-time, delayed, cancelled, departed, boarding
} 