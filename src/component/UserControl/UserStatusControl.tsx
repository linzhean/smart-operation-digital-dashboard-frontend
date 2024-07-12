import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './UserStatusControl.module.css';
import { fetchUsers, toggleUserStatus } from '../../services/UserAccountService';

// 定義user資料
interface User {
  name: string;
  id: string;
  department: string;
  email: string;
  position: string;
  status: string;
}

const UserStatusControl: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('latest');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const data = await fetchUsers();
      const formattedData: User[] = data.map((employee) => ({
        name: employee.name,
        id: employee.employeeId,
        department: employee.department,
        email: employee.email,
        position: employee.title,
        status: '停用' // 假设初始状态为停用
      }));
      setUsers(formattedData);
      setHasMore(formattedData.length >= 20); // 假设每次加载20个用户
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const fetchMoreData = async () => {
    // 模拟加载更多数据的逻辑
    if (users.length >= 200) {
      setHasMore(false);
      return;
    }

    const moreUsers: User[] = Array.from({ length: 20 }).map((_, index) => ({
      name: `New User ${users.length + index + 1}`,
      id: `00${users.length + index + 1}`,
      department: 'Department',
      email: `email${users.length + index + 1}@example.com`,
      position: 'Position',
      status: '停用',
    }));


    setUsers([...users, ...moreUsers]);
  };

  const toggleStatus = async (index: number) => {
    try {
      const user = users[index];
      await toggleUserStatus(user.id);
      const updatedUser = { ...user, status: user.status === '啟用中' ? '停用' : '啟用中' };
      const updatedUsers = [...users];
      updatedUsers[index] = updatedUser;
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDepartmentFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartmentFilter(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const sortUsers = (users: User[]) => {
    return users.sort((a, b) => {
      const idA = parseInt(a.id, 10);
      const idB = parseInt(b.id, 10);
      if (sortOrder === 'latest') {
        return idA - idB;
      } else {
        return idB - idA;
      }
    });
  };

  const filteredUsers = users.filter(user => {
    if (departmentFilter === 'all') {
      return true;
    }
    return user.department === departmentFilter;
  });

  const sortedUsers = sortUsers(filteredUsers);

  return (
    <div id="scrollableDiv" className={styles.tableContainer}>
      <div className={styles.tableFilters}>
        <select>
          <option value="latest">工號：從大到小</option>
          <option value="oldest">工號：從小到大</option>
        </select>
        <select>
          <option value="all">部門：全部</option>
          <option value="production">生產部門</option>
          <option value="sales">銷售部門</option>
          <option value="materials">物料部門</option>
        </select>
        <input type="search" placeholder="搜尋..." />
      </div>
      <InfiniteScroll
        dataLength={sortedUsers.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4 className={styles.loaderMsg}>載入中</h4>}
        endMessage={<p className={styles.endMsg}>No more users</p>}
        scrollableTarget="scrollableDiv"
      >
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>姓名</th>
              <th>工號</th>
              <th>所屬部門</th>
              <th>電子郵箱</th>
              <th>職稱</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.id}</td>
                <td>{user.department}</td>
                <td>{user.email}</td>
                <td>{user.position}</td>
                <td>
                  <div className={styles.toggleWrapper}>
                    <input
                      type="checkbox"
                      id={`dn-${index}`}
                      className={styles.dn}
                      checked={user.status === '啟用中'}
                      onChange={() => toggleStatus(index)}
                    />
                    <label htmlFor={`dn-${index}`} className={styles.toggle}>
                      <span className={styles.toggle__handler} />
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};

export default UserStatusControl;
