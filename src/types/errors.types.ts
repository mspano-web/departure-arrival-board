// errors.types.ts
// -----------------------------------------------------------

export interface IStandardError {
    name:string
    route: string
    params?: any
    exception: string
    message: string
    statusCode: string
    dateTime: string
  }

  // ------------------------------

  export interface IInternalApplicationError {
    name:string
    exception: string
    message: string
    statusCode: string
    dateTime: string
    data: any
  }

  // -----------------------------------------------------------
   