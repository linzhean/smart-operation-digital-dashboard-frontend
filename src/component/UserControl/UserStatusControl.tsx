import React, { useState, useEffect } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';

import styles from './UserStatusControl.module.css';

import { fetchUsers, toggleUserStatus, fetchTotalPages } from '../../services/UserAccountService';

import NumberOfPages from './NumberOfPages';

import { UserAccountBean } from '../../services/types/userManagement';

import { styled } from '@mui/material/styles';

import Switch from '@mui/material/Switch';

import FormControlLabel from '@mui/material/FormControlLabel';

interface User {

  name: string;

  id: string;

  department: string;

  email: string;

  position: string;

  status: string;

}

const IOSSwitch = styled(Switch)(({ theme }) => ({

  width: 60,

  height: 34,

  padding: 0,

  '& .MuiSwitch-switchBase': {

    padding: 0,

    margin: 5,

    transitionDuration: '300ms',

    '&.Mui-checked': {

      transform: 'translateX(22px)',

      color: '#fff',

      '& + .MuiSwitch-track': {

        backgroundColor: '#65C466',

        opacity: 1,

        border: 0,

      },

    },

    '&.Mui-focusVisible .MuiSwitch-thumb': {

      color: '#33cf4d',

      border: '6px solid #fff',

    },

    '&.Mui-disabled .MuiSwitch-thumb': {

      color: theme.palette.grey[100],

    },

    '&.Mui-disabled + .MuiSwitch-track': {

      opacity: 0.7,

    },

  },

  '& .MuiSwitch-thumb': {

    boxSizing: 'border-box',

    width: 24,

    height: 24,

  },

  '& .MuiSwitch-track': {

    borderRadius: 34 / 2,

    backgroundColor: 'red',

    opacity: 1,

    transition: theme.transitions.create(['background-color'], {

      duration: 500,

    }),

  },

  // 響應式的調整

  '@media (max-width: 480px)': {

    width: 50,

    height: 30,

    '& .MuiSwitch-thumb': {

      width: 20,

      height: 20,

    },

    '& .MuiSwitch-track': {

      borderRadius: 30 / 2,

    },

    // 圓點點的位置!!!!

    '& .MuiSwitch-switchBase': {

      '&.Mui-checked': {

        transform: 'translateX(19px)',

      }

    },

  },

}));

const UserStatusControl: React.FC = () => {

  const [users, setUsers] = useState<User[]>([]);

  const [hasMore, setHasMore] = useState<boolean>(true);

  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const [sortOrder, setSortOrder] = useState<string>('latest');

  const [page, setPage] = useState<number>(0);

  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {

    loadInitialData();

  }, [page]);

  const loadInitialData = async () => {

    try {

      const [data, pages] = await Promise.all([fetchUsers(page), fetchTotalPages()]);

      setTotalPages(pages);

      const formattedData: User[] = data.map((employee: UserAccountBean) => ({

        name: employee.userName,

        id: employee.userId,

        department: employee.departmentName,

        email: employee.email,

        position: employee.identity,

        status: employee.available === true ? '啟用中' : '停用'

      }));

      setUsers(formattedData);

      setHasMore(page < totalPages - 1);

    } catch (error) {

      console.error('載入用戶時出錯', error);

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

      console.error('更新用戶狀態時出錯:', error);

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

        <input type="search" placeholder="搜尋" className={styles.searchInput} />

      </div>

      <InfiniteScroll

        dataLength={sortedUsers.length}

        next={fetchMoreData}

        hasMore={hasMore}

        loader={<div className={`loadingMsg`}></div>}

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

                  <div className={styles.theToggle}>

                    <FormControlLabel

                      sx={{

                        margin: 0,

                      }}

                      control={

                        <IOSSwitch

                          checked={user.status === '啟用中'}

                          onChange={() => toggleStatus(index)}

                        />

                      }

                      label=""

                    />

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