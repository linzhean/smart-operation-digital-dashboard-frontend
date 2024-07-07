// src\services\types\Request.type.ts
export type Response<T> = {
    result: boolean;
    errorCode: string;
    message?:string;
    data?:T;
}
