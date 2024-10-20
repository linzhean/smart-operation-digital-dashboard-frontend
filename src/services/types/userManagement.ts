//src\services\types\userManagement.ts
import { ReactNode } from 'react';

export interface Group {
  id: number;
  name: string;
  createDate: string;
  modifyDate: string;
}

export interface User {
  id: number;
  groupId: number;
  userId: string; // Added userId field
  name: string;
  userName: string; // Added userName field
  department: string;
  position: string;
  userGroupId: number;
  available: boolean;
  createId: string;
  createDate: string;
  modifyId: string;
  modifyDate: string;
}


export interface EmployeeData {
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
  id: number;
  applicant: string;
  guarantor: string;
  startDate: string;
  endDate: string;
  content: string;
  applyStatus: number;
  groupId?: number;
  reason: string; 
}

export interface UserAccountBean {
  [x: string]: any;
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

// export interface UserAccountBean {
//   [x: string]: ReactNode;
//   userId: string;
//   userName: string;
//   departmentId: string;
//   departmentName: string;
//   googleId: string;
//   gmail: string;
//   identity: string;
//   position: string;
//   available: number;
//   createId: string;
//   createDate: string;
//   modifyId: string;
//   modifyDate: string;
// }

export interface AddUserToGroupRequest {
  userId: string; // 這裡假設 userId 是字符串
  groupId: number;
}

export type ApiUserData = {
  id: string;
  name: string;
  department?:string;
  departmentId?: string;   
  departmentName?: string; 
  googleId?: string;       
  gmail?: string;          
  identity?: string;       
  position?: string;       
  available?: boolean;     
  createId?: string;       
  createDate?: string;     
  modifyId?: string;       
  modifyDate?: string;     
  jobNumber?: string;      
};

export interface UpdateUserData {
  [x: string]: any;
  userId: string;
  userName: string;
  jobNumber: string;
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

export interface UserData {
  userId: string;
  userName: string;
  departmentId: string;
  departmentName: string;
  position: string;
  jobNumber:string;
}