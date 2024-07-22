import { ReactNode } from 'react';

export interface Group {
  id: number;
  name: string;
  createDate: string;
  modifyDate: string;
}

export interface User {
  id: number;
  userId: string; // Added userId field
  name: string;
  userName: string; // Added userName field
  department: string;
  position: string;
  available: boolean;
  createId: string;
  createDate: string;
  modifyId: string;
  modifyDate: string;
}


export interface EmployeeData {
  [x: string]: any;
  userId: string;
  userName: string;
  departmentName: string;
  gmail: string;
  position: string;
  available: boolean;
  createId: string;
  createDate: string;
  modifyId: string;
  modifyDate: string;
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

export interface UpdateUserData {
  name: string;
  department: string;
  position: string;
  available: boolean;
}

export interface UserAccountBean {
  userId: string;
  userName: string;
  departmentId: string;
  departmentName: string;
  googleId: string;
  gmail: string;
  identity: 'NO_PERMISSION' | 'MANAGER' | 'EMPLOYEE' | 'ADMIN';
  position: string;
  available: boolean;
  createId: string;
  createDate: string;
  modifyId: string;
  modifyDate: string;
}

export interface AddUserToGroupRequest {
  userId: string; // 這裡假設 userId 是字符串
  groupId: number;
}