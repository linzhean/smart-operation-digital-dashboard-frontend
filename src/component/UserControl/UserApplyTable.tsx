import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './UserApplyTable.module.css';
import { fetchUsers, admitUser, removeUser } from '../../services/UserAccountService';
import { UserAccountBean } from '../../services/types/userManagement';

const UserApplyTable: React.FC = () => {
  const [users, setUsers] = useState<UserAccountBean[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const data = await fetchUsers(page); // Fetch users from backend
      console.log('Fetched data:', data);
      if (Array.isArray(data)) {
        setUsers(data);
        setHasMore(data.length > 0); // Determine if there are more users
      } else {
        console.error('Error: fetchUsers did not return an array.');
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const fetchMoreData = async () => {
    // Simulating fetching more data logic
    if (users.length >= 200) {
      setHasMore(false); // Disable infinite scroll after reaching a certain limit
      return;
    }

    setPage(prevPage => prevPage + 1);
    try {
      const moreUsers = await fetchUsers(page + 1);
      if (moreUsers.length === 0) {
        setHasMore(false); // No more users to load
      }
      setUsers([...users, ...moreUsers]);
    } catch (error) {
      console.error('Error fetching more data:', error);
    }
  };

  function admitUserHandler(index: number): void {
    throw new Error('Function not implemented.');
  }

  function removeUserHandler(index: number): void {
    throw new Error('Function not implemented.');
  }

  // Other functions remain the same...

  return (
    <>
      <div className={styles.tableTitle}><h2>待审核帐号列表</h2></div>
      <div id="scrollableDiv" className={styles.thePermissionList}>
        <InfiniteScroll
          dataLength={users.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4 className={styles.loaderMsg}>加载中...</h4>}
          endMessage={<p className={styles.endMsg}>没有更多了</p>}
          scrollableTarget="scrollableDiv"
        >
          <table className={styles.thePermissionList}>
            <thead>
              <tr>
                <th>申请人</th>
                <th>工号</th>
                <th>所属部门</th>
                <th>电子邮箱</th>
                <th>职称</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.userName}</td>
                  <td>{user.userId}</td>
                  <td>{user.departmentName}</td>
                  <td>{user.gmail}</td>
                  <td>{user.position}</td>
                  <td>
                    <button className={styles.approveButton} onClick={() => admitUserHandler(index)}>开通</button>
                    <button className={styles.disapproveButton} onClick={() => removeUserHandler(index)}>删除</button>
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
