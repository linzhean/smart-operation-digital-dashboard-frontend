import React, { useState, useEffect, useMemo } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';

import styles from './UserStatusControl.module.css';

import { fetchUsers, toggleUserStatus, fetchTotalPages } from '../../services/UserAccountService';

import { fetchDropdownData } from '../../services/dropdownServices';

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

  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [departments, setDepartments] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const departmentOptions = await fetchDropdownData('department');
        setDepartments(departmentOptions);
      } catch (error) {
        console.error('加载部门数据时出错:', error);
      }
    };

    loadDepartments();
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [page, searchKeyword, departmentFilter, sortOrder]);

  const loadInitialData = async () => {
    try {
      const [data, pages] = await Promise.all([
        fetchUsers(page, departmentFilter === 'all' ? undefined : departmentFilter, undefined, undefined, searchKeyword),
        fetchTotalPages()
      ]);

      console.log('Fetched Users:', data);  // Debug log for fetched users
      console.log('Total Pages:', pages);    // Debug log for total pages

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
      setHasMore(page < pages - 1);
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
    const user = users[index];

    const confirmChange = window.confirm(`確定要將 ${user.name} 的狀態切換為 ${user.status === '啟用中' ? '停用' : '啟用中'} 嗎？`);

    if (!confirmChange) {
      return;
    }

    try {
      await toggleUserStatus(user.id);

      const updatedUser = {
        ...user,
        status: user.status === '啟用中' ? '停用' : '啟用中'
      };

      const updatedUsers = [...users];
      updatedUsers[index] = updatedUser;
      setUsers(updatedUsers);

    } catch (error) {
      console.error('更新用戶狀態時出錯:', error);
    }
  };


  const handleDepartmentFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDepartmentFilter = e.target.value;
    setDepartmentFilter(newDepartmentFilter);
    setPage(0); // 部門更改後重置頁碼
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

    setSortOrder(e.target.value);

  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setPage(0); // 重置页码为0以重新加载数据
  };

  const sortUsers = (users: User[]) => {

    return users.sort((a, b) => {

      const idA = parseInt(a.id, 5);

      const idB = parseInt(b.id, 5);

      if (sortOrder === 'latest') {

        return idB - idA;

      } else {

        return idA - idB;

      }

    });

  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (departmentFilter === 'all') {
        return true;
      }
      const selectedDepartmentLabel = departments.find(dept => dept.value === departmentFilter)?.label;
      return user.department === selectedDepartmentLabel;  // 根據部門名稱過濾
    });
  }, [users, departmentFilter, departments]);

  const sortedUsers = useMemo(() => {
    return sortUsers(filteredUsers);
  }, [filteredUsers, sortOrder]);

  console.log('Filtered and Sorted Users:', sortedUsers);

  return (

    <div id="scrollableDiv" className={styles.tableContainer}>

      <div className={styles.tableFilters}>

        <select onChange={handleDepartmentFilterChange} value={departmentFilter}>
          <option value="all">部門：全部</option>
          {departments.map(department => (
            <option value={department.value} >
              {department.label}
            </option>
          ))}
        </select>

        <input
          type="search"
          placeholder="搜尋"
          className={styles.searchInput}
          value={searchKeyword}
          onChange={handleSearchChange}
        />

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