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
  [x: string]: ReactNode;
  id: string;
  name: string;
  department: string;
  position: string;
  available: boolean; // 添加属性
  email: string; // 添加属性
}

export interface EmployeeData {
  name: string;
  employeeId: string;
  department: string;
  email: string;
  title: string;
}

