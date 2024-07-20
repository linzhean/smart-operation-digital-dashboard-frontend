// src\services\types\Request.type.ts
export type Response<T> = {
    result: boolean;
    errorCode: string;
    message?:string;
    data?:T;
}

export interface ApplicationData {
    id?: number;
    chartId?: number;
    applicant: string;
    guarantor: string;
    startDate: string;
    endDate: string;
    startDateStr?: string;
    endDateStr?: string;
    reason: string;
    applyStatus: string;
    available: boolean;
    createId: string;
    createDate: string;
    modifyId: string;
    modifyDate: string;
  }