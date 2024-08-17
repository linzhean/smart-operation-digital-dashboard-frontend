import React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import UserPickerDialog from './memberControlUserPicker';
import useGroupList from '../../Hook/useGroupList';
import styles from './GroupList.module.css';
import moreInfo from '../../assets/icon/more.svg';
import { User } from '../../services/types/userManagement';

interface GroupListProps {
  groupId: number;
  activeButton: string;
  handleButtonClick: (buttonId: string) => void;
  onDeleteGroup: (groupId: number) => void;
}

const GroupList: React.FC<GroupListProps> = ({ groupId, activeButton, handleButtonClick, onDeleteGroup }) => {
  const {
    memberData,
    showMemberPicker,
    setShowMemberPicker,
    allUsers,
    chartPermissions,
    charts,
    anchorEl,
    isMenuOpen,
    handleRemove,
    handleAddMember,
    toggleChartPermission,
    handleDeleteGroup,
    handleMenuOpen,
    handleMenuClose,
  } = useGroupList({ groupId, onDeleteGroup });

  return (
    <div>
      <div className={styles.filterButton}>
        <button
          id="memberControl"
          onClick={() => handleButtonClick('memberControl')}
          className={activeButton === 'memberControl' ? styles.filterActive : ''}
        >
          群組成員
        </button>
        <button
          id="graphControl"
          onClick={() => handleButtonClick('graphControl')}
          className={activeButton === 'graphControl' ? styles.filterActive : ''}
        >
          群組可視圖表
        </button>
      </div>

      <div className={styles.theTable}>
        {activeButton === 'memberControl' && (
          <>
            <div className={styles.buttons}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowMemberPicker(true)}
                className={styles.addButton}
              >
                新增成員
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDeleteGroup}
                className={styles.deleteGroupButton}
              >
                刪除群組
              </Button>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                className={styles.dropdownButton}
              >
                <img src={moreInfo} alt="操作" />
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={isMenuOpen}
                onClose={handleMenuClose}
                className={styles.dropdownMenu}
              >
                <MenuItem onClick={() => { setShowMemberPicker(true); handleMenuClose(); }}>新增成員</MenuItem>
                <MenuItem onClick={() => { handleDeleteGroup(); handleMenuClose(); }}>刪除群組</MenuItem>
              </Menu>
            </div>
            {showMemberPicker && (
              <UserPickerDialog
                open={showMemberPicker}
                onClose={() => setShowMemberPicker(false)}
                onSubmit={handleAddMember}
                groupId={groupId}
                users={Array.isArray(allUsers) ? allUsers.filter(user => !memberData.some(member => member.userId === user.userId)) : []}
                selectedUsers={[]}
                onAddSelectedMembers={handleAddMember}
              />
            )}
            <div className={styles.theList}>
              <table className="custom-scrollbar">
                <thead>
                  <tr>
                    <th>姓名</th>
                    <th>所屬部門</th>
                    <th>職稱</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {memberData.length > 0 ? (
                    memberData.map(member => (
                      <tr key={member.userId}>
                        <td>{member.userName}</td>
                        <td>{member.department}</td>
                        <td>{member.position || '未指定'}</td>
                        <td>
                          <Button
                            variant="outlined"
                            onClick={() => handleRemove(Number(member.userId), member.userName)}
                          >
                            移除
                          </Button>


                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4}>沒有成員</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
        {activeButton === 'graphControl' && (
          <div className={styles.theList}>
            <table className="custom-scrollbar">
              <thead>
                <tr>
                  <th>圖表名稱</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {charts.length > 0 ? (
                  charts.map(chart => (
                    <tr key={chart.id}>
                      <td>{chart.name}</td>
                      <td>
                        <button
                          className={`${styles.toggleButton} ${chartPermissions[chart.id] ? styles.allow : styles.deny}`}
                          onClick={() => toggleChartPermission(chart.id)}
                        >
                          {chartPermissions[chart.id] ? '允許' : '禁止'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={2}>沒有圖表</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default GroupList;
