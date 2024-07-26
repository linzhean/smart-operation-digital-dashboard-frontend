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
  content?: string;
}

export interface UserAccountBean {
  userId: string;
  userName: string;
  departmentId: string;
  departmentName: string;
  googleId: string;
  gmail: string;
  identity: string;
  position: string;
  available: number; 
  createId: string;
  createDate: string;
  modifyId: string;
  modifyDate: string;
}

export interface UserAccountBean {
  [x: string]: ReactNode;
  userId: string;
  userName: string;
  departmentId: string;
  departmentName: string;
  googleId: string;
  gmail: string;
  identity: string;
  position: string;
  available: number;
  createId: string;
  createDate: string;
  modifyId: string;
  modifyDate: string;
}

export interface AddUserToGroupRequest {
  userId: string; // 這裡假設 userId 是字符串
  groupId: number;
}

export type ApiUserData = {
  id: string;
  name: string;
  isAdmin: boolean;
  charAuths: any[]; // 根据实际的 charAuths 结构进行调整
};

export interface UpdateUserData {
  userId: string;
  userName: string;
  departmentId: string;
  departmentName: string;
  googleId: string;
  gmail: string;
  identity: string;
  position: string;
  available: boolean; // Update this if you handle available as boolean in your application
  createId: string;
  createDate: string;
  modifyId: string;
  modifyDate: string;
}