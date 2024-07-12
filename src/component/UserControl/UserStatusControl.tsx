import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './UserStatusControl.module.css';
import { fetchUsers, toggleUserStatus } from '../../services/UserAccountService';

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
      const updatedUser = { ...user, status: user.status === '启用中' ? '停用' : '启用中' };
      const updatedUsers = [...users];
      updatedUsers[index] = updatedUser;
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  return (
    <div id="scrollableDiv" className={styles.tableContainer}>
      <div className={styles.tableFilters}>
        <select>
          <option value="latest">排序：最新</option>
          <option value="oldest">排序：最旧</option>
        </select>
        <select>
          <option value="all">部门：全部</option>
          <option value="production">生产</option>
          <option value="sales">销售</option>
          <option value="materials">物料</option>
        </select>
        <input type="search" placeholder="搜索..." />
      </div>
      <InfiniteScroll
        dataLength={users.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4 className={styles.loaderMsg}>Loading...</h4>}
        endMessage={<p className={styles.endMsg}>No more users</p>}
        scrollableTarget="scrollableDiv"
      >
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>名称</th>
              <th>工号</th>
              <th>所属部门</th>
              <th>电子邮箱</th>
              <th>职称</th>
              <th>状态</th>
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
                      checked={user.status === '启用中'}
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
