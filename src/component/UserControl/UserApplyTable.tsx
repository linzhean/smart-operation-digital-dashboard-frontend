import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './UserApplyTable.module.css';

interface EmployeeData {
  name: string;
  employeeId: string;
  department: string;
  email: string;
  title: string;
}

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
  { name: 'Jack', employeeId: 'E010', department: 'R&D', email: 'jack@gmail.com', title: 'Research Scientist' }
];

const UserApplyTable: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>(initialEmployees);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchMoreData = () => {
    if (employees.length >= 200) { // 假設總共只有 200 個用戶，下面自動產生假的用戶
      setHasMore(false);
      return;
    }

    // 模擬獲取更多數據
    const moreEmployees: EmployeeData[] = Array.from({ length: 20 }).map((_, index) => ({
      name: `新用戶 ${employees.length + index + 1}`,
      employeeId: `E${employees.length + index + 11}`,
      department: '部門',
      email: `newuser${employees.length + index + 1}@gmail.com`,
      title: '職稱',
    }));

    setEmployees([...employees, ...moreEmployees]);
  };

  return (
    <>
      <div className={styles.tableTitle}><h2>待審核帳號列表</h2></div>
      <div id="scrollableDiv" className={styles.thePermissionList}>
        <InfiniteScroll
          dataLength={employees.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4 className={styles.loaderMsg}>加載中...</h4>}
          endMessage={<p className={styles.endMsg}>沒有更多囉</p>}
          scrollableTarget="scrollableDiv"
        >
          <table className={styles.customScrollbar}>
            <thead>
              <tr>
                <th>申請人</th>
                <th>工號</th>
                <th>所屬部門</th>
                <th>電子信箱</th>
                <th>職稱</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((app, index) => (
                <tr key={index}>
                  <td>{app.name}</td>
                  <td>{app.employeeId}</td>
                  <td>{app.department}</td>
                  <td>{app.email}</td>
                  <td>{app.title}</td>
                  <td>
                    <button className={styles.approveButton}>開通</button>
                    <button className={styles.disapproveButton}>刪除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </>
  );
};

export default UserApplyTable;
