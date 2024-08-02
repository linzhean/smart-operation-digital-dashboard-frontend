import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './UserApplyTable.module.css';
import { fetchUsers, admitUser, removeUser, fetchTotalPages } from '../../services/UserAccountService';
import { UserAccountBean } from '../../services/types/userManagement';
import NumberOfPages from './NumberOfPages';
import { useUserStatus } from '../../context/UserStatusContext';

const UserApplyTable: React.FC = () => {
  const { addUser } = useUserStatus();
  const [users, setUsers] = useState<UserAccountBean[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    loadInitialData();
  }, [page]);

  const loadInitialData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const [userResponse, pageResponse] = await Promise.all([
        fetchUsers(page, undefined, undefined, '0'),
        fetchTotalPages()
      ]);

      if (Array.isArray(userResponse)) {
        setUsers(prevUsers => page === 0 ? userResponse : [...prevUsers, ...userResponse]);
        setTotalPages(pageResponse);
        setHasMore(userResponse.length > 0 && page < pageResponse - 1);
      } else {
        console.error('錯誤：FetchUsers 沒有返回數組。');
      }
    } catch (error) {
      console.error('加載初始數據時出錯：', error);
      setErrorMessage('加載數據時出錯，請稍後重新嘗試。');
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreData = () => {
    if (page >= totalPages - 1) {
      setHasMore(false);
      return;
    }
    setPage(prevPage => prevPage + 1);
  };

  const admitUserHandler = async (index: number, identity: string) => {
    setErrorMessage('');
    try {
      const user = users[index];
      if (user.userId) {
        await admitUser(user.userId, identity);
        setUsers(prevUsers => prevUsers.filter((_, i) => i !== index));
        addUser({
          id: user.userId,
          name: user.userName,
          department: user.departmentName,
          email: user.gmail,
          status: '啟用中',
          position: ''
        });
      }
    } catch (error) {
      console.error('Error admitting user:', error);
      const errorMessage = (error as Error).message || '未知錯誤';
      setErrorMessage(`無法將用戶設為經理或員工。錯誤訊息：${errorMessage}`);
    }
  };

  const removeUserHandler = async (index: number) => {
    setErrorMessage('');
    try {
      const user = users[index];
      if (user.userId) {
        await removeUser(user.userId);
        setUsers(prevUsers => prevUsers.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error removing user:', error);
      const errorMessage = (error as Error).message || '未知錯誤';
      setErrorMessage(`無法刪除用戶。錯誤信息：${errorMessage}`);
    }
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
      <div className={styles.tableTitle}><h2>待審核帳號列表</h2></div>
      <div id="scrollableDiv" className={styles.thePermissionList}>
        {loading ? (
          <div className={styles.loaderMsg}>加載中...</div>
        ) : errorMessage ? (
          <div className={styles.errorMsg}>{errorMessage}</div>
        ) : (
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
                      <button className={styles.approveButton} onClick={() => admitUserHandler(index, '1')}>設為高階主管</button>
                      <button className={styles.approveButton} onClick={() => admitUserHandler(index, '2')}>設為員工</button>
                      <button className={styles.disapproveButton} onClick={() => removeUserHandler(index)}>刪除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </InfiniteScroll>
        )}
        {totalPages > 1 && (
          <NumberOfPages
            count={totalPages * 10}
            page={page}
            rowsPerPage={10}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default UserApplyTable;
