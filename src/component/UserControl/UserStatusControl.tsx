import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './UserStatusControl.module.css';
import { fetchUsers, toggleUserStatus, fetchTotalPages } from '../../services/UserAccountService';
import NumberOfPages from './NumberOfPages';
import { UserAccountBean } from '../../services/types/userManagement';

// 定义用户数据接口
interface User {
  name: string;
  id: string;
  department: string;
  email: string;
  position: string;
  status: string; // 用户状态（啟用中 或 停用）
}

const UserStatusControl: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('latest');
  const [page, setPage] = useState<number>(0); // 当前页码
  const [totalPages, setTotalPages] = useState<number>(1); // 总页码

  useEffect(() => {
    loadInitialData();
  }, [page]); // 页码变化时加载数据

  const loadInitialData = async () => {
    try {
      const [data, pages] = await Promise.all([fetchUsers(page), fetchTotalPages()]);
      setTotalPages(pages);

      const formattedData: User[] = data.map((employee: UserAccountBean) => ({
        name: employee.userName,
        id: employee.userId,
        department: employee.departmentName,
        email: employee.gmail,
        position: employee.position,
        status: employee.available === true ? '啟用中' : '停用' // Handle available as number
      }));
      setUsers(formattedData);
      setHasMore(page < totalPages - 1);
    } catch (error) {
      console.error('加载用户时出错:', error);
    }
  };

  const fetchMoreData = async () => {
    if (page >= totalPages - 1) {
      setHasMore(false);
      return;
    }

    setPage(prevPage => prevPage + 1);
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
      console.error('更新用户状态时出错:', error);
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
        return idB - idA;
      } else {
        return idA - idB;
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
        <select onChange={handleSortChange}>
          <option value="latest">工號：從大到小</option>
          <option value="oldest">工號：從小到大</option>
        </select>
        <select onChange={handleDepartmentFilterChange}>
          <option value="all">部門：全部</option>
          <option value="production">生產部門</option>
          <option value="sales">銷售部門</option>
          <option value="materials">物料部門</option>
        </select>
        <input type="search" placeholder="搜尋..." className={styles.searchInput} />
      </div>
      <InfiniteScroll
        dataLength={sortedUsers.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4 className={styles.loaderMsg}>載入中</h4>}
        endMessage={<p className={styles.endMsg}>沒有更多用戶</p>}
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
            {Array.isArray(sortedUsers) && sortedUsers.map((user, index) => (
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
      {totalPages > 1 && (
        <NumberOfPages
          count={totalPages * 10}
          page={page}
          rowsPerPage={10}
          onPageChange={(event, newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
};

export default UserStatusControl;
