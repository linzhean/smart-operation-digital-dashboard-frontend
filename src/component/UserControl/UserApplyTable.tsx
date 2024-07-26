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
  const [errorMessage, setErrorMessage] = useState<string>(''); // Error message state

  useEffect(() => {
    loadInitialData();
  }, [page]);

  const loadInitialData = async () => {
    setLoading(true);
    setErrorMessage(''); // 重置错误信息
    try {
      const [userResponse, pageResponse] = await Promise.all([
        fetchUsers(page, undefined, undefined, '0'), // 获取 identity 为 '0' 的用户
        fetchTotalPages()
      ]);

      console.log('User Response:', userResponse);
      console.log('Page Response:', pageResponse);

      if (Array.isArray(userResponse)) {
        const filteredUsers = userResponse.filter(user => user.identity !== '3'); // 排除管理员
        setUsers(prevUsers => page === 0 ? filteredUsers : [...prevUsers, ...filteredUsers]);
        setTotalPages(pageResponse);
        setHasMore(filteredUsers.length > 0 && page < pageResponse - 1);
      } else {
        console.error('错误：fetchUsers 没有返回数组。');
      }
    } catch (error) {
      console.error('加载初始数据时出错：', error);
      setErrorMessage('加载数据时出错，请稍后重试。');
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

  const admitUserHandler = async (index: number, identity: number) => {
    setErrorMessage(''); // 重置错误信息
    try {
      const user = users[index];
      if (user.userId) {
        // 确保身份参数是有效的
        const identityStr = identity.toString();
        if (identityStr !== '1' && identityStr !== '2') {
          throw new Error('身份参数无效');
        }
        console.log(`Admitting user ${user.userId} with identity ${identityStr}`); // 添加日志以帮助调试
        await admitUser(user.userId, identityStr); // 将身份转换为字符串
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
      console.error('Error admitting user:', error); // 打印详细错误信息
      const errorMessage = (error as Error).message || '未知錯誤'; // 类型断言为 Error
      setErrorMessage(`無法將用戶設為經理或員工。錯誤信息：${errorMessage}`);
    }
  };    

  const removeUserHandler = async (index: number) => {
    setErrorMessage(''); // 重置错误信息
    try {
      const user = users[index];
      if (user.userId) {
        await removeUser(user.userId);
        setUsers(prevUsers => prevUsers.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error removing user:', error);
      const errorMessage = (error as Error).message || '未知錯誤'; // 类型断言为 Error
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
                      <button className={styles.approveButton} onClick={() => admitUserHandler(index, 1)}>設為經理</button>
                      <button className={styles.approveButton} onClick={() => admitUserHandler(index, 2)}>設為員工</button>
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
