import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getUsers, User } from '../../../services/userManagementServices';
import '../../../styles/Admin/userTable.css';

interface UserListProps {
  addUserToGroup: (groupId: number, userId: number) => void;
  selectedGroupId: number | null;
}

const UserList: React.FC<UserListProps> = ({ addUserToGroup, selectedGroupId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await getUsers();
      if (Array.isArray(fetchedUsers)) {
        setUsers(fetchedUsers);
      } else {
        console.error('獲取的用戶數據不是一個數組:', fetchedUsers);
        generateFakeUsers();
      }
      setHasMore(false); // 假設初始加載不需要分頁
    } catch (error) {
      console.error('無法獲取用戶:', error);
      generateFakeUsers();
    } finally {
      setIsLoading(false);
    }
  };

  const generateFakeUsers = () => {
    const fakeUsers: User[] = Array.from({ length: 20 }).map((_, index) => ({
      id: `${index + 1}`,
      name: `Fake User ${index + 1}`,
      department: 'Fake Department',
      position: 'Fake Position',
      email: `fakeuser${index + 1}@example.com`,
      available: true,
    }));
    setUsers(fakeUsers);
  };

  const fetchMoreUsers = async () => {
    try {
      if (users.length >= 200) {
        setHasMore(false);
        return;
      }

      const moreUsers: User[] = Array.from({ length: 20 }).map((_, index) => ({
        id: `${users.length + index + 1}`,
        name: `New User ${users.length + index + 1}`,
        department: 'Department',
        position: 'Position',
        email: `newuser${users.length + index + 1}@example.com`,
        available: true,
      }));

      setUsers(prevUsers => [...prevUsers, ...moreUsers]);
    } catch (error) {
      console.error('加載更多用戶時出錯:', error);
    }
  };

  const handleAddUserToGroup = (userId: number) => {
    if (selectedGroupId !== null) {
      addUserToGroup(selectedGroupId, userId);
    } else {
      alert('請先選擇一個群組');
    }
  };

  return (
    <div className="user-list">
      <h3>用戶列表</h3>
      <InfiniteScroll
        dataLength={users.length}
        next={fetchMoreUsers}
        hasMore={hasMore && !isLoading}
        loader={<h4 className="loaderMsg">加載中...</h4>}
        endMessage={<p className="endMsg">沒有更多囉</p>}
        scrollableTarget="scrollableDiv"
      >
        <table className="user-table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>部門</th>
              <th>職位</th>
              <th>郵件</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.department}</td>
                <td>{user.position}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleAddUserToGroup(parseInt(user.id, 10))}>加入群組</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};

export default UserList;
