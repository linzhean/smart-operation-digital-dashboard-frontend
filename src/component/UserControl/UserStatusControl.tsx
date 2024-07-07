import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './UserStatusControl.module.css';

interface User {
  name: string;
  id: string;
  department: string;
  email: string;
  position: string;
  status: string;
}

const initialUsers: User[] = [
  { name: '張三', id: '001', department: '生產', email: 'email@example.com', position: '經理', status: '啟用中' },
  { name: '李四', id: '002', department: '銷售', email: 'email2@example.com', position: '業務', status: '停用' },
  { name: '王五', id: '003', department: '銷售', email: 'email3@example.com', position: '經理', status: '啟用中' },
  { name: '趙六', id: '004', department: '生產', email: 'email4@example.com', position: '業務', status: '停用' },
  { name: '錢七', id: '005', department: '物料', email: 'email5@example.com', position: '經理', status: '啟用中' },
  { name: '張三', id: '001', department: '生產', email: 'email@example.com', position: '經理', status: '停用' },
  { name: '李四', id: '002', department: '銷售', email: 'email2@example.com', position: '業務', status: '啟用中' },
  { name: '王五', id: '003', department: '銷售', email: 'email3@example.com', position: '經理', status: '停用' },
  { name: '趙六', id: '004', department: '生產', email: 'email4@example.com', position: '業務', status: '啟用中' },
  { name: '錢七', id: '005', department: '物料', email: 'email5@example.com', position: '經理', status: '停用' },
  { name: '張三', id: '001', department: '生產', email: 'email@example.com', position: '經理', status: '啟用中' },
  { name: '李四', id: '002', department: '銷售', email: 'email2@example.com', position: '業務', status: '停用' },
  { name: '王五', id: '003', department: '銷售', email: 'email3@example.com', position: '經理', status: '啟用中' },
  { name: '趙六', id: '004', department: '生產', email: 'email4@example.com', position: '業務', status: '停用' },
  { name: '錢七', id: '005', department: '物料', email: 'email5@example.com', position: '經理', status: '啟用中' },
  { name: '張三', id: '001', department: '生產', email: 'email@example.com', position: '經理', status: '停用' },
  { name: '李四', id: '002', department: '銷售', email: 'email2@example.com', position: '業務', status: '啟用中' },
  { name: '王五', id: '003', department: '銷售', email: 'email3@example.com', position: '經理', status: '停用' },
  { name: '趙六', id: '004', department: '生產', email: 'email4@example.com', position: '業務', status: '啟用中' },
  { name: '錢七', id: '005', department: '物料', email: 'email5@example.com', position: '經理', status: '停用' },
];

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchMoreData = () => {
    if (users.length >= 200) { // 假設總共只有 200 個用戶，下面自動產生假的用戶
      setHasMore(false);
      return;
    }

    // 模擬獲取更多數據
    const moreUsers: User[] = Array.from({ length: 20 }).map((_, index) => ({
      name: `新用戶 ${users.length + index + 1}`,
      id: `00${users.length + index + 1}`,
      department: '部門',
      email: `email${users.length + index + 1}@example.com`,
      position: '職稱',
      status: '停用',
    }));

    setUsers([...users, ...moreUsers]);
  };

  // 需要二次確認
  const toggleStatus = (index: number) => {
    const user = users[index];
    const confirmation = window.confirm(`您確定要${user.status === '啟用中' ? '停用' : '啟用'}【 ${user.name} 】的帳號嗎？`);
    if (confirmation) {
      const updatedUsers = [...users];
      updatedUsers[index].status = updatedUsers[index].status === '啟用中' ? '停用' : '啟用中';
      setUsers(updatedUsers);
    }
  };

  return (
    <div id="scrollableDiv" className={styles.tableContainer}>
      <div className={styles.tableFilters}>
        <select>
          <option value="latest">排序：最新</option>
          <option value="oldest">排序：最舊</option>
        </select>
        <select>
          <option value="all">部門：全部</option>
          <option value="production">生產</option>
          <option value="sales">銷售</option>
          <option value="materials">物料</option>
        </select>
        <input type="search" placeholder="搜尋..." />
      </div>
      <InfiniteScroll
        dataLength={users.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4 className={styles.loaderMsg}>加載中...</h4>}
        endMessage={<p className={styles.endMsg}>沒有更多囉</p>}
        scrollableTarget="scrollableDiv"
      >
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>名稱</th>
              <th>工號</th>
              <th>所屬部門</th>
              <th>電子信箱</th>
              <th>職稱</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.id}</td>
                <td>{user.department}</td>
                <td>{user.email}</td>
                <td>{user.position}</td>
                <td>

                  {/* 開關按鈕 */}
                  <div className={styles.toggleWrapper}>
                    <input
                      type="checkbox"
                      id={`dn-${index}`}
                      className={styles.dn}
                      checked={user.status === '啟用中'}
                      onChange={() => toggleStatus(index)}
                    />

                    <label htmlFor={`dn-${index}`} className={styles.toggle}>
                      {/* 白色那塊遮擋物.toggle__handler */}
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

export default UserTable;
