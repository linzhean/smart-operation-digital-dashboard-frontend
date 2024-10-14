import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Button, Snackbar, Alert } from '@mui/material';
import styles from './UserApplyTable.module.css';
import { fetchUsers, admitUser, removeUser, fetchTotalPages } from '../../services/UserAccountService';
import { UserAccountBean } from '../../services/types/userManagement';
import NumberOfPages from './NumberOfPages';
import { useUserStatus } from '../../context/UserStatusContext';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';

const UserApplyTable: React.FC = () => {
  const { addUser } = useUserStatus();
  const [users, setUsers] = useState<UserAccountBean[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  useEffect(() => {
    loadInitialData();
  }, [page]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
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
        throw new Error('FetchUsers 沒有返回數組');
      }
    } catch (error) {
      console.error('加載初始數據時出錯：', error);
      setError('加載數據時出錯');
      setSnackbarOpen(true);
      setHasMore(false);
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

  const admitUserHandler = async (index: number) => {
    setError(null);
    try {
      const user = users[index];
      if (user.userId) {
        await admitUser(user.userId);
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
      setError(`無法開通用戶 錯誤訊息：${errorMessage}`);
      setSnackbarOpen(true);
    }
  };

  const removeUserHandler = async (index: number) => {
    setError(null);
    try {
      const user = users[index];
      if (user.userId) {
        await removeUser(user.userId);
        setUsers(prevUsers => prevUsers.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error removing user:', error);
      const errorMessage = (error as Error).message || '未知錯誤';
      setError(`無法刪除用戶 錯誤訊息：${errorMessage}`);
      setSnackbarOpen(true);
    }
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    setSnackbarOpen(false);
  };

  const handleRetry = () => {
    loadInitialData();
  };

  return (
    <>
      <div className={styles.tableTitle}>待審核帳號列表</div>
      <div id="scrollableDiv" className={styles.thePermissionList}>
        {loading ? (
          <div className={`loadingMsg`}></div>
        ) : error ? (
          <> </>
        ) : (
          <InfiniteScroll
            dataLength={users.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<div className={`loadingMsg`}></div>}
            endMessage={!error && users.length > 0 && <p className={styles.endMsg}>沒有更多了</p>}
            scrollableTarget="scrollableDiv"
          >
            <div className={styles.theTable}>

              <div className={styles.theList}>
                <table>
                  <thead>
                    <tr>
                      <th>申請人</th>
                      <th>員工編號</th>
                      <th>所屬部門</th>
                      <th>信箱</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.userId}>
                        <td>{user.userName}</td>
                        <td>{user.userId}</td>
                        <td>{user.departmentName}</td>
                        <td>{user.email}</td>
                        <td>
                          <button className={styles.approveButton} onClick={() => admitUserHandler(index)}>開通</button>
                          <button className={styles.disapproveButton} onClick={() => removeUserHandler(index)}>刪除</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </InfiniteScroll>
        )}
        {!loading && !error && totalPages > 1 && (
          <NumberOfPages
            count={totalPages * 10}
            page={page}
            rowsPerPage={10}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ zIndex: 999999999999 }}
      >
        <Alert
          severity="error"
          variant="filled"
          icon={false}
          sx={{
            width: '400px',
            backgroundColor: '#F5F5F5',
            color: '#000000',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            position: 'relative',
          }}
        >

          <IconButton
            aria-label="close"
            onClick={handleSnackbarClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'black',
            }}
          >
            <CloseIcon />
          </IconButton>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ErrorIcon style={{ marginRight: '12px', color: 'black', verticalAlign: 'middle' }} />
            <span style={{ verticalAlign: 'middle', fontSize: '1.2rem' }}>{error}</span>
          </div>

          <Button
            color="inherit"
            size="small"
            onClick={handleRetry}
            sx={{
              fontSize: '1rem',
              width: '100%',
              backgroundColor: '#FFD700',
              color: '#000000',
              fontWeight: '900',
              borderRadius: '8px',
              border: '2px solid #000000',
              '&:hover': {
                backgroundColor: '#F0E68C',
              },
              padding: '8px 0',
              marginTop: '12px',
            }}
          >
            重新嘗試
          </Button>
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserApplyTable;