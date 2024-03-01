// config.types.ts 
// --------------------------------------------------------------


export interface IWebServer {
    port: string,
    host: string
}

// ----------------------------

// ManagementSystemServer
export interface IMMS_Server {
    protocol: string,
    host: string
    port: string,
}

// ----------------------------

export interface ISecurity {
    cors: string
}



// Basic configuration control ------------------------------------

export const DEV: string    = "DEV"       // NODE_ENV (shell) 

