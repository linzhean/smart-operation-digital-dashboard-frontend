// src/services/types/userManagement.ts
import { ReactNode } from 'react';

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
  id: string; // 假設這是用戶的唯一 ID
  name: string;
  department: string;
  position: string;
  available: boolean;
  email: string;
}


export interface EmployeeData {
  name: string;
  employeeId: string;
  department: string;
  email: string;
  title: string;
}

