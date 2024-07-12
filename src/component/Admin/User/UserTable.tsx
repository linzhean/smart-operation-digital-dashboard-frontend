import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { User } from '../../../services/types/userManagement';
import '../../../styles/Admin/userTable.css';

interface UserTableProps {
  users: User[] | null | undefined; // 确保用户数据可以为 null 或 undefined
  onDeleteUserFromGroup: (userId: string) => void;
  deleteUser: (userId: string) => Promise<void>;
  admitUser: (userId: string) => Promise<void>;
}

const UserTable: React.FC<UserTableProps> = ({ users, onDeleteUserFromGroup, deleteUser, admitUser }) => {
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const initialUsers = Array.isArray(users) ? users.slice(0, 20) : generateMockUsers(20);
    setDisplayedUsers(initialUsers);
    setHasMore(Array.isArray(users) ? users.length > 20 : true);
  }, [users]);

  const fetchMoreUsers = () => {
    const moreUsers = Array.isArray(users)
      ? users.slice(displayedUsers.length, displayedUsers.length + 20)
      : generateMockUsers(20, displayedUsers.length);
    setDisplayedUsers(prevUsers => [...prevUsers, ...moreUsers]);
    setHasMore(Array.isArray(users) ? displayedUsers.length + 20 < users.length : true);
  };

  const generateMockUsers = (count: number, startId = 0): User[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: (startId + index + 1).toString(),
      name: `Mock User ${startId + index + 1}`,
      department: 'Mock Department',
      position: 'Mock Position',
      email: `mockuser${startId + index + 1}@example.com`,
      // 添加其他 User 类型的字段
      available: true,
      createId: `creator${startId + index + 1}`,
      createDate: new Date().toISOString(),
      modifyId: `modifier${startId + index + 1}`,
      modifyDate: new Date().toISOString(),
    }));
  };

  const handleDeleteUserFromGroup = (userId: string) => {
    onDeleteUserFromGroup(userId);
  };

  return (
    <div>
      <h2>群组使用者列表</h2>
      <div id="scrollableDiv" style={{ height: '400px', overflow: 'auto' }}>
        <InfiniteScroll
          dataLength={displayedUsers.length}
          next={fetchMoreUsers}
          hasMore={hasMore}
          loader={<h4 className="loaderMsg">加载中...</h4>}
          endMessage={<p className="endMsg">没有更多了</p>}
          scrollableTarget="scrollableDiv"
        >
          <table className="user-table">
            <thead>
              <tr>
                <th>姓名</th>
                <th>部门</th>
                <th>职位</th>
                <th>邮箱</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.department}</td>
                  <td>{user.position}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="delete-button" onClick={() => handleDeleteUserFromGroup(user.id)}>
                      从群组中删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default UserTable;
