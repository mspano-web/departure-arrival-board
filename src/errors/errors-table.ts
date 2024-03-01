export class ErrorTable {
    private errorMap: Map<string, { internalMessage: string, clientMessage: string }>;
    private static instance: ErrorTable;

    private constructor() {
        this.errorMap = new Map<string, { internalMessage: string, clientMessage: string }>([
            ["PAR_001", { internalMessage: "Event type cannot be empty.", clientMessage: "Event type cannot be empty" }],
            ["PAR_002", { internalMessage: "The code cannot be empty.", clientMessage: "The code cannot be empty" }],
            ["PAR_003", { internalMessage: "The location cannot be empty.", clientMessage: "The location cannot be empty" }],
            ["PAR_004", { internalMessage: "The point cannot be empty.", clientMessage: "The point cannot be empty" }],
            ["PAR_005", { internalMessage: "The status cannot be empty.", clientMessage: "The status cannot be empty" }],
            ["PAR_006", { internalMessage: "The time cannot be empty.", clientMessage: "The time cannot be empty" }],
            ["PAR_007", { internalMessage: "Type must to be departure or arrival only.", clientMessage: "Type must to be departure or arrival only" }],
            ["PAR_008", { internalMessage: "Request without parameters.", clientMessage: "Request without parameters" }],
            ["PAR_009", { internalMessage: "The Terminal field is required.", clientMessage: "The Terminal field is required" }],
            ["PAR_010", { internalMessage: "Event not supplied to the notifyEvent service.", clientMessage: "Event not supplied to the notifyEvent service" }],
            ["PAR_011", { internalMessage: "Non-existent event type is detected when processing notification.", clientMessage: "Non-existent event type is detected when processing notification" }],
        // ------------------------------------------------------------------            
            ["APP_001", { internalMessage: "Terminal already registered.", clientMessage: "Terminal already registered" }],
            ["APP_002", { internalMessage: "There is no information on arrivals and departures.", clientMessage: "There is no information on arrivals and departures" }],
        // ------------------------------------------------------------------            
            ["SYS_001", { internalMessage: "The management system has drawbacks. Contact administrator.", clientMessage: "The management system has drawbacks. Contact administrator" }],
            ["SYS_002", { internalMessage: "Failure in creating memory lists. Lists not provided.", clientMessage: "Failure in creating memory lists. Lists not provided" }],
            ["SYS_003", { internalMessage: "Memory System has drawbacks. Contact administrator.", clientMessage: "Memory System has drawbacks. Contact administrator" }],
            ["SYS_004", { internalMessage: "Terminal manager system has drawbacks. Contact administrator.", clientMessage: "Terminal manager system has drawbacks. Contact administrator" }],
            ["SYS_005", { internalMessage: "Problems in communication with the Management System.", clientMessage: "Problems in communication with the Management System" }],
            ["SYS_006", { internalMessage: "Management System out of service.", clientMessage: "Management System out of service" }],
                        
        ]);
    }

    public static getInstance(): ErrorTable {
        if (!ErrorTable.instance) {
            ErrorTable.instance = new ErrorTable();
        }
        return ErrorTable.instance;
    }

    public getErrorMessages(errorCode: string): { internalMessage: string, clientMessage: string } {
        const error = this.errorMap.get(errorCode);
        if (error) {
            return error;
        }
        return {
            internalMessage: "Unknown error.",
            clientMessage: "An unexpected error occurred."
        };
    }
}