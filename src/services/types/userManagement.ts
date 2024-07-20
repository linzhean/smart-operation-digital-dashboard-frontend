import { ReactNode } from 'react';

export interface Group {
  id: number;
  name: string;
  available: boolean;
  createId: string;
  createDate: string;
  modifyId: string;
  modifyDate: string;
  users?: number[];
}

export interface User {
  [x: string]: ReactNode;
  id: number;
  name: string;
  userId: string;
  userName: string;
  departmentId: string;
  departmentName: string;
  googleId: string;
  gmail: string;
  identity: string;
  position: string| null;
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
  userId: string;
  userName: string;
  departmentId: string;
  departmentName: string;
  googleId: string;
  gmail: string;
  identity: string;
  position: string;
  available: boolean;
  createId: string;
  createDate: string;
  modifyId: string;
  modifyDate: string;
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
  userId: string;
  groupId: number;
}