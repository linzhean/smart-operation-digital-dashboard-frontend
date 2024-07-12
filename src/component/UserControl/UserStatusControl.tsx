import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './UserStatusControl.module.css';

// 定義user資料
interface User {
  name: string;
  id: string;
  department: string;
  email: string;
  position: string;
  status: string;
}

//假資料
const initialUsers: User[] = [
  { name: '張三', id: '001', department: '生產', email: 'zhangsan1@gmail.com', position: '經理', status: '啟用中' },
  { name: '李四', id: '002', department: '銷售', email: 'lisi2@gmail.com', position: '業務', status: '停用' },
  { name: '王五', id: '003', department: '物料', email: 'wangwu3@gmail.com', position: '經理', status: '啟用中' },
  { name: '趙六', id: '004', department: '生產', email: 'zhaoliu4@gmail.com', position: '業務', status: '停用' },
  { name: '錢七', id: '005', department: '銷售', email: 'qianqi5@gmail.com', position: '經理', status: '啟用中' },
  { name: '孫八', id: '006', department: '物料', email: 'sunba6@gmail.com', position: '業務', status: '停用' },
  { name: '周九', id: '007', department: '生產', email: 'zhoujiu7@gmail.com', position: '經理', status: '啟用中' },
  { name: '吳十', id: '008', department: '銷售', email: 'wushi8@gmail.com', position: '業務', status: '停用' },
  { name: '鄭十一', id: '009', department: '物料', email: 'zhengshiyi9@gmail.com', position: '經理', status: '啟用中' },
  { name: '王十二', id: '010', department: '生產', email: 'wangshier10@gmail.com', position: '業務', status: '停用' },
  { name: '李十三', id: '011', department: '銷售', email: 'lishisan11@gmail.com', position: '經理', status: '啟用中' },
  { name: '趙十四', id: '012', department: '物料', email: 'zhaoshisi12@gmail.com', position: '業務', status: '停用' },
  { name: '孫十五', id: '013', department: '生產', email: 'sunshiwu13@gmail.com', position: '經理', status: '啟用中' },
  { name: '周十六', id: '014', department: '銷售', email: 'zhoushiliu14@gmail.com', position: '業務', status: '停用' },
  { name: '吳十七', id: '015', department: '物料', email: 'wushiqi15@gmail.com', position: '經理', status: '啟用中' },
  { name: '鄭十八', id: '016', department: '生產', email: 'zhengshiba16@gmail.com', position: '業務', status: '停用' },
  { name: '王十九', id: '017', department: '銷售', email: 'wangshijiu17@gmail.com', position: '經理', status: '啟用中' },
  { name: '李二十', id: '018', department: '物料', email: 'liershi20@gmail.com', position: '業務', status: '停用' },
  { name: '趙二十一', id: '019', department: '生產', email: 'zhaoershiyi21@gmail.com', position: '經理', status: '啟用中' },
  { name: '孫二十二', id: '020', department: '銷售', email: 'sunershier22@gmail.com', position: '業務', status: '停用' },
];

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('latest');

  const fetchMoreData = () => {
    if (users.length >= 200) {
      setHasMore(false);
      return;
    }

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

  // 開關
  const toggleStatus = (index: number) => {
    const user = users[index];
    const confirmation = window.confirm(`⚠️您確定要${user.status === '啟用中' ? '停用' : '啟用'}【 ${user.name} 】的帳號嗎？`);
    if (confirmation) {
      const updatedUsers = [...users];
      updatedUsers[index].status = updatedUsers[index].status === '啟用中' ? '停用' : '啟用中';
      setUsers(updatedUsers);
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
        <select value={sortOrder} onChange={handleSortChange}>
          <option value="latest">工號：從小到大</option>
          <option value="oldest">工號：從大到小</option>
        </select>
        <select value={departmentFilter} onChange={handleDepartmentFilterChange}>
          <option value="all">部門：全部</option>
          <option value="生產">生產</option>
          <option value="銷售">銷售</option>
          <option value="物料">物料</option>
        </select>
        <input type="search" placeholder="搜尋..." />
      </div>
      <InfiniteScroll
        dataLength={sortedUsers.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <>
            <div className={styles.theLoadingBall}>
              <div className={styles.threeBalls}>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
              </div>
            </div>
          </>
        }
        endMessage={<p className={styles.endMsg}>大家都到齊囉</p>}
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
            {sortedUsers.map((user, index) => (
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

export default UserTable;
