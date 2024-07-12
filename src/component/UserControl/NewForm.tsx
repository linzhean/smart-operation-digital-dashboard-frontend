import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Button, CircularProgress } from '@mui/material';
import NumberOfPages from './NumberOfPages';
import Box from '@mui/material';

//分頁加載或分步加載（pagination or incremental loading）
//如何知道總共有多少頁??
//請求數據時>後端返回total count
//可以根據每頁顯示的數量計算出總頁數

interface EmployeeData {
  name: string;
  employeeId: string;
  department: string;
  email: string;
  title: string;
  status?: string;  //這是狀態 表示開通或是拒絕
}

//定義mui表單樣式
const useStyles = makeStyles({
  theContent: {
    backgroundColor: '#343541 !important', overflowY: 'hidden'
  },
  thePermissionList: {
    borderRadius: '15px',
    '& *': {
      color: '#CCCCCC !important',
      fontWeight: 'bold !important',
      fontSize: '1rem !important'
    },
    '& table': {
      overflow: 'auto',
      width: '100%',
      borderCollapse: 'collapse',
      borderRadius: '10px',
      lineHeight: '1.5 !important',
    },
    '& th, & td': {
      padding: '15px',
      textAlign: 'center',
      borderBottom: '1px solid #444',
    },
    '& th': {
      backgroundColor: '#444',
    },
    '& tr:nth-child(even)': {
      backgroundColor: '#444',
    },
    '& tr:last-child td': {
      borderBottom: 'none',
    },
  },
  disapproveButton: {
    marginTop: '5px !important',
    marginLeft: '5px !important',
    backgroundColor: '#d9534f !important',
    color: '#fff !important',
    border: 'none !important',
    padding: '5px 10px !important',
    cursor: 'pointer !important',
    borderRadius: '5px !important',
    transition: 'background-color 0.3s !important',
    '&:hover': {
      backgroundColor: '#A52824 !important',
    },
  },
  approveButton: {
    marginTop: '5px !important',
    marginLeft: '5px !important',
    backgroundColor: '#94C546 !important',
    color: '#fff !important',
    border: 'none !important',
    padding: '5px 10px !important',
    cursor: 'pointer !important',
    borderRadius: '5px !important',
    transition: 'background-color 0.3s !important',
    '&:hover': {
      backgroundColor: '#6E8B30 !important',
    },
  },
  loaderMsg: {
    textAlign: 'center',
    marginTop: '20px',
  },
  endMsg: {
    textAlign: 'center',
    margin: '20px',
  },
  '@media (max-width: 528px)': {
    theContent: {
      width: '100%',
    },
  },
  scrollbar: {
    '&::-webkit-scrollbar': {
      width: '0.2em !important',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#ACACBE',
      border: '0.1em solid #343541',
      borderRadius: '100vw',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: 'rgba(204, 204, 204, 0.5)',
    },
    '&::-webkit-scrollbar-button': {
      display: 'none',
    },
  },
});

// 後端獲取數據模擬函數
const fetchFromBackend = (page: number, rowsPerPage: number): Promise<{ data: EmployeeData[], total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = page * rowsPerPage;
      const end = start + rowsPerPage;
      const data = initialEmployees.slice(start, end);
      resolve({ data, total: initialEmployees.length });
    }, 1000); // 模擬延遲!!!
  });
};

//先放假的數據顯示一下
const initialEmployees: EmployeeData[] = [
  { name: 'Amy', employeeId: 'E001', department: 'Finance', email: 'amy@gmail.com', title: 'Analyst' },
  { name: 'Bob', employeeId: 'E002', department: 'HR', email: 'bob@gmail.com', title: 'HR Manager' },
  { name: 'Cathy', employeeId: 'E003', department: 'IT', email: 'cathy@gmail.com', title: 'Developer' },
  { name: 'David', employeeId: 'E004', department: 'Sales', email: 'david@gmail.com', title: 'Sales Representative' },
  { name: 'Eva', employeeId: 'E005', department: 'Marketing', email: 'eva@gmail.com', title: 'Marketing Specialist' },
  { name: 'Frank', employeeId: 'E006', department: 'Support', email: 'frank@gmail.com', title: 'Support Engineer' },
  { name: 'Grace', employeeId: 'E007', department: 'Legal', email: 'grace@gmail.com', title: 'Legal Advisor' },
  { name: 'Henry', employeeId: 'E008', department: 'Operations', email: 'henry@gmail.com', title: 'Operations Manager' },
  { name: 'Ivy', employeeId: 'E009', department: 'Admin', email: 'ivy@gmail.com', title: 'Administrative Assistant' },
  { name: 'Jack', employeeId: 'E010', department: 'R&D', email: 'jack@gmail.com', title: 'Research Scientist' },
  { name: 'Kelly', employeeId: 'E011', department: 'Finance', email: 'kelly@gmail.com', title: 'Accountant' },
  { name: 'Leo', employeeId: 'E012', department: 'HR', email: 'leo@gmail.com', title: 'Recruiter' },
  { name: 'Mike', employeeId: 'E013', department: 'IT', email: 'mike@gmail.com', title: 'System Administrator' },
  { name: 'Nina', employeeId: 'E014', department: 'Sales', email: 'nina@gmail.com', title: 'Sales Manager' },
  { name: 'Oliver', employeeId: 'E015', department: 'Marketing', email: 'oliver@gmail.com', title: 'Marketing Director' },
  { name: 'Pam', employeeId: 'E016', department: 'Support', email: 'pam@gmail.com', title: 'Customer Support' },
  { name: 'Quinn', employeeId: 'E017', department: 'Legal', email: 'quinn@gmail.com', title: 'Paralegal' },
  { name: 'Rachel', employeeId: 'E018', department: 'Operations', email: 'rachel@gmail.com', title: 'Operations Coordinator' },
  { name: 'Steve', employeeId: 'E019', department: 'Admin', email: 'steve@gmail.com', title: 'Office Manager' },
  { name: 'Tina', employeeId: 'E020', department: 'R&D', email: 'tina@gmail.com', title: 'Lab Technician' }, { name: 'Amy', employeeId: 'E001', department: 'Finance', email: 'amy@gmail.com', title: 'Analyst' },
  { name: 'Bob', employeeId: 'E002', department: 'HR', email: 'bob@gmail.com', title: 'HR Manager' },
  { name: 'Cathy', employeeId: 'E003', department: 'IT', email: 'cathy@gmail.com', title: 'Developer' },
  { name: 'David', employeeId: 'E004', department: 'Sales', email: 'david@gmail.com', title: 'Sales Representative' },
  { name: 'Eva', employeeId: 'E005', department: 'Marketing', email: 'eva@gmail.com', title: 'Marketing Specialist' },
  { name: 'Frank', employeeId: 'E006', department: 'Support', email: 'frank@gmail.com', title: 'Support Engineer' },
  { name: 'Grace', employeeId: 'E007', department: 'Legal', email: 'grace@gmail.com', title: 'Legal Advisor' },
  { name: 'Henry', employeeId: 'E008', department: 'Operations', email: 'henry@gmail.com', title: 'Operations Manager' },
  { name: 'Ivy', employeeId: 'E009', department: 'Admin', email: 'ivy@gmail.com', title: 'Administrative Assistant' },
  { name: 'Jack', employeeId: 'E010', department: 'R&D', email: 'jack@gmail.com', title: 'Research Scientist' },
  { name: 'Kelly', employeeId: 'E011', department: 'Finance', email: 'kelly@gmail.com', title: 'Accountant' },
  { name: 'Leo', employeeId: 'E012', department: 'HR', email: 'leo@gmail.com', title: 'Recruiter' },
  { name: 'Mike', employeeId: 'E013', department: 'IT', email: 'mike@gmail.com', title: 'System Administrator' },
  { name: 'Nina', employeeId: 'E014', department: 'Sales', email: 'nina@gmail.com', title: 'Sales Manager' },
  { name: 'Oliver', employeeId: 'E015', department: 'Marketing', email: 'oliver@gmail.com', title: 'Marketing Director' },
  { name: 'Pam', employeeId: 'E016', department: 'Support', email: 'pam@gmail.com', title: 'Customer Support' },
  { name: 'Quinn', employeeId: 'E017', department: 'Legal', email: 'quinn@gmail.com', title: 'Paralegal' },
  { name: 'Rachel', employeeId: 'E018', department: 'Operations', email: 'rachel@gmail.com', title: 'Operations Coordinator' },
  { name: 'Steve', employeeId: 'E019', department: 'Admin', email: 'steve@gmail.com', title: 'Office Manager' },
  { name: 'Tina', employeeId: 'E020', department: 'R&D', email: 'tina@gmail.com', title: 'Lab Technician' }, { name: 'Amy', employeeId: 'E001', department: 'Finance', email: 'amy@gmail.com', title: 'Analyst' },
  { name: 'Bob', employeeId: 'E002', department: 'HR', email: 'bob@gmail.com', title: 'HR Manager' },
  { name: 'Cathy', employeeId: 'E003', department: 'IT', email: 'cathy@gmail.com', title: 'Developer' },
  { name: 'David', employeeId: 'E004', department: 'Sales', email: 'david@gmail.com', title: 'Sales Representative' },
  { name: 'Eva', employeeId: 'E005', department: 'Marketing', email: 'eva@gmail.com', title: 'Marketing Specialist' },
  { name: 'Frank', employeeId: 'E006', department: 'Support', email: 'frank@gmail.com', title: 'Support Engineer' },
  { name: 'Grace', employeeId: 'E007', department: 'Legal', email: 'grace@gmail.com', title: 'Legal Advisor' },
  { name: 'Henry', employeeId: 'E008', department: 'Operations', email: 'henry@gmail.com', title: 'Operations Manager' },
  { name: 'Ivy', employeeId: 'E009', department: 'Admin', email: 'ivy@gmail.com', title: 'Administrative Assistant' },
  { name: 'Jack', employeeId: 'E010', department: 'R&D', email: 'jack@gmail.com', title: 'Research Scientist' },
  { name: 'Kelly', employeeId: 'E011', department: 'Finance', email: 'kelly@gmail.com', title: 'Accountant' },
  { name: 'Leo', employeeId: 'E012', department: 'HR', email: 'leo@gmail.com', title: 'Recruiter' },
  { name: 'Mike', employeeId: 'E013', department: 'IT', email: 'mike@gmail.com', title: 'System Administrator' },
  { name: 'Nina', employeeId: 'E014', department: 'Sales', email: 'nina@gmail.com', title: 'Sales Manager' },
  { name: 'Oliver', employeeId: 'E015', department: 'Marketing', email: 'oliver@gmail.com', title: 'Marketing Director' },
  { name: 'Pam', employeeId: 'E016', department: 'Support', email: 'pam@gmail.com', title: 'Customer Support' },
  { name: 'Quinn', employeeId: 'E017', department: 'Legal', email: 'quinn@gmail.com', title: 'Paralegal' },
  { name: 'Rachel', employeeId: 'E018', department: 'Operations', email: 'rachel@gmail.com', title: 'Operations Coordinator' },
  { name: 'Steve', employeeId: 'E019', department: 'Admin', email: 'steve@gmail.com', title: 'Office Manager' },
  { name: 'Tina', employeeId: 'E020', department: 'R&D', email: 'tina@gmail.com', title: 'Lab Technician' }, { name: 'Amy', employeeId: 'E001', department: 'Finance', email: 'amy@gmail.com', title: 'Analyst' },
  { name: 'Bob', employeeId: 'E002', department: 'HR', email: 'bob@gmail.com', title: 'HR Manager' },
  { name: 'Cathy', employeeId: 'E003', department: 'IT', email: 'cathy@gmail.com', title: 'Developer' },
  { name: 'David', employeeId: 'E004', department: 'Sales', email: 'david@gmail.com', title: 'Sales Representative' },
  { name: 'Eva', employeeId: 'E005', department: 'Marketing', email: 'eva@gmail.com', title: 'Marketing Specialist' },
  { name: 'Frank', employeeId: 'E006', department: 'Support', email: 'frank@gmail.com', title: 'Support Engineer' },
  { name: 'Grace', employeeId: 'E007', department: 'Legal', email: 'grace@gmail.com', title: 'Legal Advisor' },
  { name: 'Henry', employeeId: 'E008', department: 'Operations', email: 'henry@gmail.com', title: 'Operations Manager' },
  { name: 'Ivy', employeeId: 'E009', department: 'Admin', email: 'ivy@gmail.com', title: 'Administrative Assistant' },
  { name: 'Jack', employeeId: 'E010', department: 'R&D', email: 'jack@gmail.com', title: 'Research Scientist' },
  { name: 'Kelly', employeeId: 'E011', department: 'Finance', email: 'kelly@gmail.com', title: 'Accountant' },
  { name: 'Leo', employeeId: 'E012', department: 'HR', email: 'leo@gmail.com', title: 'Recruiter' },
  { name: 'Mike', employeeId: 'E013', department: 'IT', email: 'mike@gmail.com', title: 'System Administrator' },
  { name: 'Nina', employeeId: 'E014', department: 'Sales', email: 'nina@gmail.com', title: 'Sales Manager' },
  { name: 'Oliver', employeeId: 'E015', department: 'Marketing', email: 'oliver@gmail.com', title: 'Marketing Director' },
  { name: 'Pam', employeeId: 'E016', department: 'Support', email: 'pam@gmail.com', title: 'Customer Support' },
  { name: 'Quinn', employeeId: 'E017', department: 'Legal', email: 'quinn@gmail.com', title: 'Paralegal' },
  { name: 'Rachel', employeeId: 'E018', department: 'Operations', email: 'rachel@gmail.com', title: 'Operations Coordinator' },
  { name: 'Steve', employeeId: 'E019', department: 'Admin', email: 'steve@gmail.com', title: 'Office Manager' },
  { name: 'Tina', employeeId: 'E020', department: 'R&D', email: 'tina@gmail.com', title: 'Lab Technician' }, { name: 'Amy', employeeId: 'E001', department: 'Finance', email: 'amy@gmail.com', title: 'Analyst' },
  { name: 'Bob', employeeId: 'E002', department: 'HR', email: 'bob@gmail.com', title: 'HR Manager' },
  { name: 'Cathy', employeeId: 'E003', department: 'IT', email: 'cathy@gmail.com', title: 'Developer' },
  { name: 'David', employeeId: 'E004', department: 'Sales', email: 'david@gmail.com', title: 'Sales Representative' },
  { name: 'Eva', employeeId: 'E005', department: 'Marketing', email: 'eva@gmail.com', title: 'Marketing Specialist' },
  { name: 'Frank', employeeId: 'E006', department: 'Support', email: 'frank@gmail.com', title: 'Support Engineer' },
  { name: 'Grace', employeeId: 'E007', department: 'Legal', email: 'grace@gmail.com', title: 'Legal Advisor' },
  { name: 'Henry', employeeId: 'E008', department: 'Operations', email: 'henry@gmail.com', title: 'Operations Manager' },
  { name: 'Ivy', employeeId: 'E009', department: 'Admin', email: 'ivy@gmail.com', title: 'Administrative Assistant' },
  { name: 'Jack', employeeId: 'E010', department: 'R&D', email: 'jack@gmail.com', title: 'Research Scientist' },
  { name: 'Kelly', employeeId: 'E011', department: 'Finance', email: 'kelly@gmail.com', title: 'Accountant' },
  { name: 'Leo', employeeId: 'E012', department: 'HR', email: 'leo@gmail.com', title: 'Recruiter' },
  { name: 'Mike', employeeId: 'E013', department: 'IT', email: 'mike@gmail.com', title: 'System Administrator' },
  { name: 'Nina', employeeId: 'E014', department: 'Sales', email: 'nina@gmail.com', title: 'Sales Manager' },
  { name: 'Oliver', employeeId: 'E015', department: 'Marketing', email: 'oliver@gmail.com', title: 'Marketing Director' },
  { name: 'Pam', employeeId: 'E016', department: 'Support', email: 'pam@gmail.com', title: 'Customer Support' },
  { name: 'Quinn', employeeId: 'E017', department: 'Legal', email: 'quinn@gmail.com', title: 'Paralegal' },
  { name: 'Rachel', employeeId: 'E018', department: 'Operations', email: 'rachel@gmail.com', title: 'Operations Coordinator' },
  { name: 'Steve', employeeId: 'E019', department: 'Admin', email: 'steve@gmail.com', title: 'Office Manager' },
  { name: 'Tina', employeeId: 'E020', department: 'R&D', email: 'tina@gmail.com', title: 'Lab Technician' }, { name: 'Amy', employeeId: 'E001', department: 'Finance', email: 'amy@gmail.com', title: 'Analyst' },
  { name: 'Bob', employeeId: 'E002', department: 'HR', email: 'bob@gmail.com', title: 'HR Manager' },
  { name: 'Cathy', employeeId: 'E003', department: 'IT', email: 'cathy@gmail.com', title: 'Developer' },
  { name: 'David', employeeId: 'E004', department: 'Sales', email: 'david@gmail.com', title: 'Sales Representative' },
  { name: 'Eva', employeeId: 'E005', department: 'Marketing', email: 'eva@gmail.com', title: 'Marketing Specialist' },
  { name: 'Frank', employeeId: 'E006', department: 'Support', email: 'frank@gmail.com', title: 'Support Engineer' },
  { name: 'Grace', employeeId: 'E007', department: 'Legal', email: 'grace@gmail.com', title: 'Legal Advisor' },
  { name: 'Henry', employeeId: 'E008', department: 'Operations', email: 'henry@gmail.com', title: 'Operations Manager' },
  { name: 'Ivy', employeeId: 'E009', department: 'Admin', email: 'ivy@gmail.com', title: 'Administrative Assistant' },
  { name: 'Jack', employeeId: 'E010', department: 'R&D', email: 'jack@gmail.com', title: 'Research Scientist' },
  { name: 'Kelly', employeeId: 'E011', department: 'Finance', email: 'kelly@gmail.com', title: 'Accountant' },
  { name: 'Leo', employeeId: 'E012', department: 'HR', email: 'leo@gmail.com', title: 'Recruiter' },
  { name: 'Mike', employeeId: 'E013', department: 'IT', email: 'mike@gmail.com', title: 'System Administrator' },
  { name: 'Nina', employeeId: 'E014', department: 'Sales', email: 'nina@gmail.com', title: 'Sales Manager' },
  { name: 'Oliver', employeeId: 'E015', department: 'Marketing', email: 'oliver@gmail.com', title: 'Marketing Director' },
  { name: 'Pam', employeeId: 'E016', department: 'Support', email: 'pam@gmail.com', title: 'Customer Support' },
  { name: 'Quinn', employeeId: 'E017', department: 'Legal', email: 'quinn@gmail.com', title: 'Paralegal' },
  { name: 'Rachel', employeeId: 'E018', department: 'Operations', email: 'rachel@gmail.com', title: 'Operations Coordinator' },
  { name: 'Steve', employeeId: 'E019', department: 'Admin', email: 'steve@gmail.com', title: 'Office Manager' },
  { name: 'Tina', employeeId: 'E020', department: 'R&D', email: 'tina@gmail.com', title: 'Lab Technician' }, { name: 'Amy', employeeId: 'E001', department: 'Finance', email: 'amy@gmail.com', title: 'Analyst' },
  { name: 'Bob', employeeId: 'E002', department: 'HR', email: 'bob@gmail.com', title: 'HR Manager' },
  { name: 'Cathy', employeeId: 'E003', department: 'IT', email: 'cathy@gmail.com', title: 'Developer' },
  { name: 'David', employeeId: 'E004', department: 'Sales', email: 'david@gmail.com', title: 'Sales Representative' },
  { name: 'Eva', employeeId: 'E005', department: 'Marketing', email: 'eva@gmail.com', title: 'Marketing Specialist' },
  { name: 'Frank', employeeId: 'E006', department: 'Support', email: 'frank@gmail.com', title: 'Support Engineer' },
  { name: 'Grace', employeeId: 'E007', department: 'Legal', email: 'grace@gmail.com', title: 'Legal Advisor' },
  { name: 'Henry', employeeId: 'E008', department: 'Operations', email: 'henry@gmail.com', title: 'Operations Manager' },
  { name: 'Ivy', employeeId: 'E009', department: 'Admin', email: 'ivy@gmail.com', title: 'Administrative Assistant' },
  { name: 'Jack', employeeId: 'E010', department: 'R&D', email: 'jack@gmail.com', title: 'Research Scientist' },
  { name: 'Kelly', employeeId: 'E011', department: 'Finance', email: 'kelly@gmail.com', title: 'Accountant' },
  { name: 'Leo', employeeId: 'E012', department: 'HR', email: 'leo@gmail.com', title: 'Recruiter' },
  { name: 'Mike', employeeId: 'E013', department: 'IT', email: 'mike@gmail.com', title: 'System Administrator' },
  { name: 'Nina', employeeId: 'E014', department: 'Sales', email: 'nina@gmail.com', title: 'Sales Manager' },
  { name: 'Oliver', employeeId: 'E015', department: 'Marketing', email: 'oliver@gmail.com', title: 'Marketing Director' },
  { name: 'Pam', employeeId: 'E016', department: 'Support', email: 'pam@gmail.com', title: 'Customer Support' },
  { name: 'Quinn', employeeId: 'E017', department: 'Legal', email: 'quinn@gmail.com', title: 'Paralegal' },
  { name: 'Rachel', employeeId: 'E018', department: 'Operations', email: 'rachel@gmail.com', title: 'Operations Coordinator' },
  { name: 'Steve', employeeId: 'E019', department: 'Admin', email: 'steve@gmail.com', title: 'Office Manager' },
  { name: 'Tina', employeeId: 'E020', department: 'R&D', email: 'tina@gmail.com', title: 'Lab Technician' }, { name: 'Amy', employeeId: 'E001', department: 'Finance', email: 'amy@gmail.com', title: 'Analyst' },
  { name: 'Bob', employeeId: 'E002', department: 'HR', email: 'bob@gmail.com', title: 'HR Manager' },
  { name: 'Cathy', employeeId: 'E003', department: 'IT', email: 'cathy@gmail.com', title: 'Developer' },
  { name: 'David', employeeId: 'E004', department: 'Sales', email: 'david@gmail.com', title: 'Sales Representative' },
  { name: 'Eva', employeeId: 'E005', department: 'Marketing', email: 'eva@gmail.com', title: 'Marketing Specialist' },
  { name: 'Frank', employeeId: 'E006', department: 'Support', email: 'frank@gmail.com', title: 'Support Engineer' },
  { name: 'Grace', employeeId: 'E007', department: 'Legal', email: 'grace@gmail.com', title: 'Legal Advisor' },
  { name: 'Henry', employeeId: 'E008', department: 'Operations', email: 'henry@gmail.com', title: 'Operations Manager' },
  { name: 'Ivy', employeeId: 'E009', department: 'Admin', email: 'ivy@gmail.com', title: 'Administrative Assistant' },
  { name: 'Jack', employeeId: 'E010', department: 'R&D', email: 'jack@gmail.com', title: 'Research Scientist' },
  { name: 'Kelly', employeeId: 'E011', department: 'Finance', email: 'kelly@gmail.com', title: 'Accountant' },
  { name: 'Leo', employeeId: 'E012', department: 'HR', email: 'leo@gmail.com', title: 'Recruiter' },
  { name: 'Mike', employeeId: 'E013', department: 'IT', email: 'mike@gmail.com', title: 'System Administrator' },
  { name: 'Nina', employeeId: 'E014', department: 'Sales', email: 'nina@gmail.com', title: 'Sales Manager' },
  { name: 'Oliver', employeeId: 'E015', department: 'Marketing', email: 'oliver@gmail.com', title: 'Marketing Director' },
  { name: 'Pam', employeeId: 'E016', department: 'Support', email: 'pam@gmail.com', title: 'Customer Support' },
  { name: 'Quinn', employeeId: 'E017', department: 'Legal', email: 'quinn@gmail.com', title: 'Paralegal' },
  { name: 'Rachel', employeeId: 'E018', department: 'Operations', email: 'rachel@gmail.com', title: 'Operations Coordinator' },
  { name: 'Steve', employeeId: 'E019', department: 'Admin', email: 'steve@gmail.com', title: 'Office Manager' },
  { name: 'Tina', employeeId: 'E020', department: 'R&D', email: 'tina@gmail.com', title: 'Lab Technician' }, { name: 'Amy', employeeId: 'E001', department: 'Finance', email: 'amy@gmail.com', title: 'Analyst' },
  { name: 'Bob', employeeId: 'E002', department: 'HR', email: 'bob@gmail.com', title: 'HR Manager' },
  { name: 'Cathy', employeeId: 'E003', department: 'IT', email: 'cathy@gmail.com', title: 'Developer' },
  { name: 'David', employeeId: 'E004', department: 'Sales', email: 'david@gmail.com', title: 'Sales Representative' },
  { name: 'Eva', employeeId: 'E005', department: 'Marketing', email: 'eva@gmail.com', title: 'Marketing Specialist' },
  { name: 'Frank', employeeId: 'E006', department: 'Support', email: 'frank@gmail.com', title: 'Support Engineer' },
  { name: 'Grace', employeeId: 'E007', department: 'Legal', email: 'grace@gmail.com', title: 'Legal Advisor' },
  { name: 'Henry', employeeId: 'E008', department: 'Operations', email: 'henry@gmail.com', title: 'Operations Manager' },
  { name: 'Ivy', employeeId: 'E009', department: 'Admin', email: 'ivy@gmail.com', title: 'Administrative Assistant' },
  { name: 'Jack', employeeId: 'E010', department: 'R&D', email: 'jack@gmail.com', title: 'Research Scientist' },
  { name: 'Kelly', employeeId: 'E011', department: 'Finance', email: 'kelly@gmail.com', title: 'Accountant' },
  { name: 'Leo', employeeId: 'E012', department: 'HR', email: 'leo@gmail.com', title: 'Recruiter' },
  { name: 'Mike', employeeId: 'E013', department: 'IT', email: 'mike@gmail.com', title: 'System Administrator' },
  { name: 'Nina', employeeId: 'E014', department: 'Sales', email: 'nina@gmail.com', title: 'Sales Manager' },
  { name: 'Oliver', employeeId: 'E015', department: 'Marketing', email: 'oliver@gmail.com', title: 'Marketing Director' },
  { name: 'Pam', employeeId: 'E016', department: 'Support', email: 'pam@gmail.com', title: 'Customer Support' },
  { name: 'Quinn', employeeId: 'E017', department: 'Legal', email: 'quinn@gmail.com', title: 'Paralegal' },
  { name: 'Rachel', employeeId: 'E018', department: 'Operations', email: 'rachel@gmail.com', title: 'Operations Coordinator' },
  { name: 'Steve', employeeId: 'E019', department: 'Admin', email: 'steve@gmail.com', title: 'Office Manager' },
  { name: 'Tina', employeeId: 'E020', department: 'R&D', email: 'tina@gmail.com', title: 'Lab Technician' }, { name: 'Amy', employeeId: 'E001', department: 'Finance', email: 'amy@gmail.com', title: 'Analyst' },
  { name: 'Bob', employeeId: 'E002', department: 'HR', email: 'bob@gmail.com', title: 'HR Manager' },
  { name: 'Cathy', employeeId: 'E003', department: 'IT', email: 'cathy@gmail.com', title: 'Developer' },
  { name: 'David', employeeId: 'E004', department: 'Sales', email: 'david@gmail.com', title: 'Sales Representative' },
  { name: 'Eva', employeeId: 'E005', department: 'Marketing', email: 'eva@gmail.com', title: 'Marketing Specialist' },
  { name: 'Frank', employeeId: 'E006', department: 'Support', email: 'frank@gmail.com', title: 'Support Engineer' },
  { name: 'Grace', employeeId: 'E007', department: 'Legal', email: 'grace@gmail.com', title: 'Legal Advisor' },
  { name: 'Henry', employeeId: 'E008', department: 'Operations', email: 'henry@gmail.com', title: 'Operations Manager' },
  { name: 'Ivy', employeeId: 'E009', department: 'Admin', email: 'ivy@gmail.com', title: 'Administrative Assistant' },
  { name: 'Jack', employeeId: 'E010', department: 'R&D', email: 'jack@gmail.com', title: 'Research Scientist' },
  { name: 'Kelly', employeeId: 'E011', department: 'Finance', email: 'kelly@gmail.com', title: 'Accountant' },
  { name: 'Leo', employeeId: 'E012', department: 'HR', email: 'leo@gmail.com', title: 'Recruiter' },
  { name: 'Mike', employeeId: 'E013', department: 'IT', email: 'mike@gmail.com', title: 'System Administrator' },
  { name: 'Nina', employeeId: 'E014', department: 'Sales', email: 'nina@gmail.com', title: 'Sales Manager' },
  { name: 'Oliver', employeeId: 'E015', department: 'Marketing', email: 'oliver@gmail.com', title: 'Marketing Director' },
  { name: 'Pam', employeeId: 'E016', department: 'Support', email: 'pam@gmail.com', title: 'Customer Support' },
  { name: 'Quinn', employeeId: 'E017', department: 'Legal', email: 'quinn@gmail.com', title: 'Paralegal' },
  { name: 'Rachel', employeeId: 'E018', department: 'Operations', email: 'rachel@gmail.com', title: 'Operations Coordinator' },
  { name: 'Steve', employeeId: 'E019', department: 'Admin', email: 'steve@gmail.com', title: 'Office Manager' },
  { name: 'Tina', employeeId: 'E020', department: 'R&D', email: 'tina@gmail.com', title: 'Lab Technician' }, { name: 'Amy', employeeId: 'E001', department: 'Finance', email: 'amy@gmail.com', title: 'Analyst' },
  { name: 'Bob', employeeId: 'E002', department: 'HR', email: 'bob@gmail.com', title: 'HR Manager' },
  { name: 'Cathy', employeeId: 'E003', department: 'IT', email: 'cathy@gmail.com', title: 'Developer' },
  { name: 'David', employeeId: 'E004', department: 'Sales', email: 'david@gmail.com', title: 'Sales Representative' },
  { name: 'Eva', employeeId: 'E005', department: 'Marketing', email: 'eva@gmail.com', title: 'Marketing Specialist' },
  { name: 'Frank', employeeId: 'E006', department: 'Support', email: 'frank@gmail.com', title: 'Support Engineer' },
  { name: 'Grace', employeeId: 'E007', department: 'Legal', email: 'grace@gmail.com', title: 'Legal Advisor' },
  { name: 'Henry', employeeId: 'E008', department: 'Operations', email: 'henry@gmail.com', title: 'Operations Manager' },
  { name: 'Ivy', employeeId: 'E009', department: 'Admin', email: 'ivy@gmail.com', title: 'Administrative Assistant' },
  { name: 'Jack', employeeId: 'E010', department: 'R&D', email: 'jack@gmail.com', title: 'Research Scientist' },
  { name: 'Kelly', employeeId: 'E011', department: 'Finance', email: 'kelly@gmail.com', title: 'Accountant' },
  { name: 'Leo', employeeId: 'E012', department: 'HR', email: 'leo@gmail.com', title: 'Recruiter' },
  { name: 'Mike', employeeId: 'E013', department: 'IT', email: 'mike@gmail.com', title: 'System Administrator' },
  { name: 'Nina', employeeId: 'E014', department: 'Sales', email: 'nina@gmail.com', title: 'Sales Manager' },
  { name: 'Oliver', employeeId: 'E015', department: 'Marketing', email: 'oliver@gmail.com', title: 'Marketing Director' },
  { name: 'Pam', employeeId: 'E016', department: 'Support', email: 'pam@gmail.com', title: 'Customer Support' },
  { name: 'Quinn', employeeId: 'E017', department: 'Legal', email: 'quinn@gmail.com', title: 'Paralegal' },
  { name: 'Rachel', employeeId: 'E018', department: 'Operations', email: 'rachel@gmail.com', title: 'Operations Coordinator' },
  { name: 'Steve', employeeId: 'E019', department: 'Admin', email: 'steve@gmail.com', title: 'Office Manager' },
  { name: 'Tina', employeeId: 'E020', department: 'R&D', email: 'tina@gmail.com', title: 'Lab Technician' }, { name: 'Amy', employeeId: 'E001', department: 'Finance', email: 'amy@gmail.com', title: 'Analyst' },
  { name: 'Bob', employeeId: 'E002', department: 'HR', email: 'bob@gmail.com', title: 'HR Manager' },
  { name: 'Cathy', employeeId: 'E003', department: 'IT', email: 'cathy@gmail.com', title: 'Developer' },
  { name: 'David', employeeId: 'E004', department: 'Sales', email: 'david@gmail.com', title: 'Sales Representative' },
  { name: 'Eva', employeeId: 'E005', department: 'Marketing', email: 'eva@gmail.com', title: 'Marketing Specialist' },
  { name: 'Frank', employeeId: 'E006', department: 'Support', email: 'frank@gmail.com', title: 'Support Engineer' },
  { name: 'Grace', employeeId: 'E007', department: 'Legal', email: 'grace@gmail.com', title: 'Legal Advisor' },
  { name: 'Henry', employeeId: 'E008', department: 'Operations', email: 'henry@gmail.com', title: 'Operations Manager' },
  { name: 'Ivy', employeeId: 'E009', department: 'Admin', email: 'ivy@gmail.com', title: 'Administrative Assistant' },
  { name: 'Jack', employeeId: 'E010', department: 'R&D', email: 'jack@gmail.com', title: 'Research Scientist' },
  { name: 'Kelly', employeeId: 'E011', department: 'Finance', email: 'kelly@gmail.com', title: 'Accountant' },
  { name: 'Leo', employeeId: 'E012', department: 'HR', email: 'leo@gmail.com', title: 'Recruiter' },
  { name: 'Mike', employeeId: 'E013', department: 'IT', email: 'mike@gmail.com', title: 'System Administrator' },
  { name: 'Nina', employeeId: 'E014', department: 'Sales', email: 'nina@gmail.com', title: 'Sales Manager' },
  { name: 'Oliver', employeeId: 'E015', department: 'Marketing', email: 'oliver@gmail.com', title: 'Marketing Director' },
  { name: 'Pam', employeeId: 'E016', department: 'Support', email: 'pam@gmail.com', title: 'Customer Support' },
  { name: 'Quinn', employeeId: 'E017', department: 'Legal', email: 'quinn@gmail.com', title: 'Paralegal' },
  { name: 'Rachel', employeeId: 'E018', department: 'Operations', email: 'rachel@gmail.com', title: 'Operations Coordinator' },
  { name: 'Steve', employeeId: 'E019', department: 'Admin', email: 'steve@gmail.com', title: 'Office Manager' },
  { name: 'Tina', employeeId: 'E020', department: 'R&D', email: 'tina@gmail.com', title: 'Lab Technician' }, { name: 'Amy', employeeId: 'E001', department: 'Finance', email: 'amy@gmail.com', title: 'Analyst' },
  { name: 'Bob', employeeId: 'E002', department: 'HR', email: 'bob@gmail.com', title: 'HR Manager' },
  { name: 'Cathy', employeeId: 'E003', department: 'IT', email: 'cathy@gmail.com', title: 'Developer' },
  { name: 'David', employeeId: 'E004', department: 'Sales', email: 'david@gmail.com', title: 'Sales Representative' },
  { name: 'Eva', employeeId: 'E005', department: 'Marketing', email: 'eva@gmail.com', title: 'Marketing Specialist' },
  { name: 'Frank', employeeId: 'E006', department: 'Support', email: 'frank@gmail.com', title: 'Support Engineer' },
  { name: 'Grace', employeeId: 'E007', department: 'Legal', email: 'grace@gmail.com', title: 'Legal Advisor' },
  { name: 'Henry', employeeId: 'E008', department: 'Operations', email: 'henry@gmail.com', title: 'Operations Manager' },
  { name: 'Ivy', employeeId: 'E009', department: 'Admin', email: 'ivy@gmail.com', title: 'Administrative Assistant' },
  { name: 'Jack', employeeId: 'E010', department: 'R&D', email: 'jack@gmail.com', title: 'Research Scientist' },
  { name: 'Kelly', employeeId: 'E011', department: 'Finance', email: 'kelly@gmail.com', title: 'Accountant' },
  { name: 'Leo', employeeId: 'E012', department: 'HR', email: 'leo@gmail.com', title: 'Recruiter' },
  { name: 'Mike', employeeId: 'E013', department: 'IT', email: 'mike@gmail.com', title: 'System Administrator' },
  { name: 'Nina', employeeId: 'E014', department: 'Sales', email: 'nina@gmail.com', title: 'Sales Manager' },
  { name: 'Oliver', employeeId: 'E015', department: 'Marketing', email: 'oliver@gmail.com', title: 'Marketing Director' },
  { name: 'Pam', employeeId: 'E016', department: 'Support', email: 'pam@gmail.com', title: 'Customer Support' },
  { name: 'Quinn', employeeId: 'E017', department: 'Legal', email: 'quinn@gmail.com', title: 'Paralegal' },
  { name: 'Rachel', employeeId: 'E018', department: 'Operations', email: 'rachel@gmail.com', title: 'Operations Coordinator' },
  { name: 'Steve', employeeId: 'E019', department: 'Admin', email: 'steve@gmail.com', title: 'Office Manager' },
  { name: 'Tina', employeeId: 'E020', department: 'R&D', email: 'tina@gmail.com', title: 'Lab Technician' }, { name: 'Amy', employeeId: 'E001', department: 'Finance', email: 'amy@gmail.com', title: 'Analyst' },
  { name: 'Bob', employeeId: 'E002', department: 'HR', email: 'bob@gmail.com', title: 'HR Manager' },
  { name: 'Cathy', employeeId: 'E003', department: 'IT', email: 'cathy@gmail.com', title: 'Developer' },
  { name: 'David', employeeId: 'E004', department: 'Sales', email: 'david@gmail.com', title: 'Sales Representative' },
  { name: 'Eva', employeeId: 'E005', department: 'Marketing', email: 'eva@gmail.com', title: 'Marketing Specialist' },
  { name: 'Frank', employeeId: 'E006', department: 'Support', email: 'frank@gmail.com', title: 'Support Engineer' },
  { name: 'Grace', employeeId: 'E007', department: 'Legal', email: 'grace@gmail.com', title: 'Legal Advisor' },
  { name: 'Henry', employeeId: 'E008', department: 'Operations', email: 'henry@gmail.com', title: 'Operations Manager' },
  { name: 'Ivy', employeeId: 'E009', department: 'Admin', email: 'ivy@gmail.com', title: 'Administrative Assistant' },
  { name: 'Jack', employeeId: 'E010', department: 'R&D', email: 'jack@gmail.com', title: 'Research Scientist' },
  { name: 'Kelly', employeeId: 'E011', department: 'Finance', email: 'kelly@gmail.com', title: 'Accountant' },
  { name: 'Leo', employeeId: 'E012', department: 'HR', email: 'leo@gmail.com', title: 'Recruiter' },
  { name: 'Mike', employeeId: 'E013', department: 'IT', email: 'mike@gmail.com', title: 'System Administrator' },
  { name: 'Nina', employeeId: 'E014', department: 'Sales', email: 'nina@gmail.com', title: 'Sales Manager' },
  { name: 'Oliver', employeeId: 'E015', department: 'Marketing', email: 'oliver@gmail.com', title: 'Marketing Director' },
  { name: 'Pam', employeeId: 'E016', department: 'Support', email: 'pam@gmail.com', title: 'Customer Support' },
  { name: 'Quinn', employeeId: 'E017', department: 'Legal', email: 'quinn@gmail.com', title: 'Paralegal' },
  { name: 'Rachel', employeeId: 'E018', department: 'Operations', email: 'rachel@gmail.com', title: 'Operations Coordinator' },
  { name: 'Steve', employeeId: 'E019', department: 'Admin', email: 'steve@gmail.com', title: 'Office Manager' },
  { name: 'Tina', employeeId: 'E020', department: 'R&D', email: 'tina@gmail.com', title: 'Lab Technician' }, { name: 'Amy', employeeId: 'E001', department: 'Finance', email: 'amy@gmail.com', title: 'Analyst' },
  { name: 'Bob', employeeId: 'E002', department: 'HR', email: 'bob@gmail.com', title: 'HR Manager' },
  { name: 'Cathy', employeeId: 'E003', department: 'IT', email: 'cathy@gmail.com', title: 'Developer' },
  { name: 'David', employeeId: 'E004', department: 'Sales', email: 'david@gmail.com', title: 'Sales Representative' },
  { name: 'Eva', employeeId: 'E005', department: 'Marketing', email: 'eva@gmail.com', title: 'Marketing Specialist' },
  { name: 'Frank', employeeId: 'E006', department: 'Support', email: 'frank@gmail.com', title: 'Support Engineer' },
  { name: 'Grace', employeeId: 'E007', department: 'Legal', email: 'grace@gmail.com', title: 'Legal Advisor' },
  { name: 'Henry', employeeId: 'E008', department: 'Operations', email: 'henry@gmail.com', title: 'Operations Manager' },
  { name: 'Ivy', employeeId: 'E009', department: 'Admin', email: 'ivy@gmail.com', title: 'Administrative Assistant' },
  { name: 'Jack', employeeId: 'E010', department: 'R&D', email: 'jack@gmail.com', title: 'Research Scientist' },
  { name: 'Kelly', employeeId: 'E011', department: 'Finance', email: 'kelly@gmail.com', title: 'Accountant' },
  { name: 'Leo', employeeId: 'E012', department: 'HR', email: 'leo@gmail.com', title: 'Recruiter' },
  { name: 'Mike', employeeId: 'E013', department: 'IT', email: 'mike@gmail.com', title: 'System Administrator' },
  { name: 'Nina', employeeId: 'E014', department: 'Sales', email: 'nina@gmail.com', title: 'Sales Manager' },
  { name: 'Oliver', employeeId: 'E015', department: 'Marketing', email: 'oliver@gmail.com', title: 'Marketing Director' },
  { name: 'Pam', employeeId: 'E016', department: 'Support', email: 'pam@gmail.com', title: 'Customer Support' },
  { name: 'Quinn', employeeId: 'E017', department: 'Legal', email: 'quinn@gmail.com', title: 'Paralegal' },
  { name: 'Rachel', employeeId: 'E018', department: 'Operations', email: 'rachel@gmail.com', title: 'Operations Coordinator' },
  { name: 'Steve', employeeId: 'E019', department: 'Admin', email: 'steve@gmail.com', title: 'Office Manager' },
  { name: 'Tina', employeeId: 'E020', department: 'R&D', email: 'tina@gmail.com', title: 'Lab Technician' }, { name: 'Amy', employeeId: 'E001', department: 'Finance', email: 'amy@gmail.com', title: 'Analyst' },

];

const NewForm: React.FC = () => {
  const classes = useStyles();
  const [employees, setEmployees] = useState<EmployeeData[]>([]);  //員工數據的狀態
  const [page, setPage] = useState(0); //頁碼的狀態
  const [totalRows, setTotalRows] = useState(0); //總行數的狀態
  const [loading, setLoading] = useState(false); //加載??

  const rowsPerPage = 10; //每一份要顯示多少行的資料?

  //獲取員工數據的異步函數
  const fetchEmployees = async (page: number, rowsPerPage: number) => {
    setLoading(true);
    const response = await fetchFromBackend(page, rowsPerPage);
    setEmployees(response.data);
    setTotalRows(response.total);
    setLoading(false);
  };

  //頁碼變化時重新獲取數據
  useEffect(() => {
    fetchEmployees(page, rowsPerPage);
  }, [page]);

  //處理頁碼變化
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
      <h2 style={{
        fontSize: '1.5rem',
        margin: '10px',
        marginBottom: '15px',
        fontWeight: 'bolder',
      }}>
        待審核帳號列表
      </h2>
      <Paper className={classes.theContent}>
        <TableContainer className={classes.thePermissionList}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>名字</TableCell>
                <TableCell>員工編號</TableCell>
                <TableCell>部門</TableCell>
                <TableCell>職位</TableCell>
                <TableCell>郵箱</TableCell>
                <TableCell>狀態</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.employeeId}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.title}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.status || '未處理'}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      className={classes.approveButton}
                      // onClick={() => handleStatusChange(employee.employeeId, '開通')}
                      onClick={() => { console.log('開通') }}
                    >
                      開通
                    </Button>
                    <Button
                      variant="contained"
                      className={classes.disapproveButton}
                      // onClick={() => handleStatusChange(employee.employeeId, '拒絕')}
                      onClick={() => { console.log('拒絕') }}
                    >
                      拒絕
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {loading && (
            <div className={classes.loaderMsg}>
              <CircularProgress />
              <div>加載中...</div>
            </div>
          )}
          {!loading && employees.length === 0 && (
            <div className={classes.endMsg}>已到最後一頁</div>
          )}
        </TableContainer>
        {/* <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <TablePagination
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            // ActionsComponent={NumberOfPages}
            rowsPerPageOptions={[]}
            sx={{
              '.MuiTablePagination-displayedRows': {
                color: 'white',
                fontSize: '14px',
              },
              '.MuiTablePagination-actions': {
                color: 'white',
                fontSize: '14px',
              },
              '.MuiTablePagination-actions > button': {
                color: 'white',
                fontSize: '16px',
              },
            }}
          />
        </div> */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <TablePagination
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            ActionsComponent={(props) => <NumberOfPages {...props} />}
            rowsPerPageOptions={[]}
            sx={{
              '.MuiTablePagination-displayedRows': {
                color: 'white',
                fontSize: '14px',
              },
              '.MuiTablePagination-actions': {
                color: 'white',
                fontSize: '14px',
              },
              '.MuiTablePagination-actions > button': {
                color: 'white',
                fontSize: '16px',
              },
            }}
          />
        </div>
      </Paper>
    </>
  );
};

export default NewForm;
