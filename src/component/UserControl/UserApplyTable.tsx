import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './UserApplyTable.module.css';
import { fetchUsers, admitUser, removeUser, fetchTotalPages } from '../../services/UserAccountService';
import { UserAccountBean } from '../../services/types/userManagement';
import NumberOfPages from './NumberOfPages';

const UserApplyTable: React.FC = () => {
  const [users, setUsers] = useState<UserAccountBean[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    loadInitialData();
  }, [page]);

  const loadInitialData = async () => {
    try {
      const [userResponse, pageResponse] = await Promise.all([
        fetchUsers(page),
        fetchTotalPages()
      ]);

      if (Array.isArray(userResponse)) {
        setUsers(prevUsers => page === 0 ? userResponse : [...prevUsers, ...userResponse]);
        setTotalPages(pageResponse); // Set total pages from response
        setHasMore(userResponse.length > 0 && page < pageResponse - 1); // Determine if there are more pages
      } else {
        console.error('Error: fetchUsers did not return an array.');
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const fetchMoreData = () => {
    if (page >= totalPages - 1) {
      setHasMore(false);
      return;
    }
    setPage(prevPage => prevPage + 1);
  };

  const admitUserHandler = async (index: number) => {
    try {
      const user = users[index];
      if (user.userId) {
        await admitUser(user.userId);
        setUsers(prevUsers => prevUsers.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error admitting user:', error);
    }
  };

  const removeUserHandler = async (index: number) => {
    try {
      const user = users[index];
      if (user.userId) {
        await removeUser(user.userId);
        setUsers(prevUsers => prevUsers.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
      <div className={styles.tableTitle}><h2>待審核帳號列表</h2></div>
      <div id="scrollableDiv" className={styles.thePermissionList}>
        <InfiniteScroll
          dataLength={users.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4 className={styles.loaderMsg}>加載中...</h4>}
          endMessage={<p className={styles.endMsg}>沒有更多了</p>}
          scrollableTarget="scrollableDiv"
        >
          <table className={styles.thePermissionList}>
            <thead>
              <tr>
                <th>申請人</th>
                <th>員工編號</th>
                <th>所屬部門</th>
                <th>信箱</th>
                <th>職稱</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.userId}>
                  <td>{user.userName}</td>
                  <td>{user.userId}</td>
                  <td>{user.departmentName}</td>
                  <td>{user.gmail}</td>
                  <td>{user.position}</td>
                  <td>
                    <button className={styles.approveButton} onClick={() => admitUserHandler(index)}>開通</button>
                    <button className={styles.disapproveButton} onClick={() => removeUserHandler(index)}>刪除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
        <NumberOfPages
          count={totalPages}
          page={page}
          rowsPerPage={10} // Assuming 10 items per page
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default UserApplyTable;
