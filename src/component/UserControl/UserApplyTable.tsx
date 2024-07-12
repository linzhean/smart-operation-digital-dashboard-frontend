import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './UserApplyTable.module.css';
import { fetchUsers, admitUser } from '../../services/UserAccountService';

interface EmployeeData {
  name: string;
  employeeId: string;
  department: string;
  email: string;
  title: string;
}

const UserApplyTable: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const data = await fetchUsers();
      if (Array.isArray(data)) {
        setEmployees(data);
        setHasMore(false); // 假设初始加载不需要分页
      } else {
        console.error('Error: fetchUsers returned data that is not an array.');
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const fetchMoreData = async () => {
    // 模拟加载更多数据的逻辑
    if (employees.length >= 200) {
      setHasMore(false);
      return;
    }

    const moreEmployees: EmployeeData[] = Array.from({ length: 20 }).map((_, index) => ({
      name: `New User ${employees.length + index + 1}`,
      employeeId: `E${employees.length + index + 11}`,
      department: 'Department',
      email: `newuser${employees.length + index + 1}@example.com`,
      title: 'Title',
    }));

    setEmployees([...employees, ...moreEmployees]);
  };

  const admitEmployee = async (index: number) => {
    try {
      const employee = employees[index];
      await admitUser(employee.employeeId);
      const updatedEmployees = employees.filter((_, i) => i !== index);
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error('Error admitting user:', error);
    }
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
          <table className={styles.thePermissionList}>
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
              {Array.isArray(employees) && employees.map((employee, index) => (
                <tr key={index}>
                  <td>{employee.name}</td>
                  <td>{employee.employeeId}</td>
                  <td>{employee.department}</td>
                  <td>{employee.email}</td>
                  <td>{employee.title}</td>
                  <td>
                    <button className={styles.approveButton} onClick={() => admitEmployee(index)}>開通</button>
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
