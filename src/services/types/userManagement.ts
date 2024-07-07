// src/services/types/userManagement.ts
export interface Group {
    id: number;
    name: string;
    available: boolean;
    createId: string;
    createDate: string;
    modifyId: string;
    modifyDate: string | null;
  }
  
  export interface User {
    id: string;
    name: string;
    department: string;
    position: string;
  }