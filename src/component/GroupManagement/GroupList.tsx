import React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import UserPickerDialog from './memberControlUserPicker';
import ChartPickerDialog from './ChartPickerDialog';
import useGroupList from '../../Hook/useGroupList';
import styles from './GroupList.module.css';
import moreInfo from '../../assets/icon/more.png';

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
    charts,
    allCharts,
    anchorEl,
    isMenuOpen,
    handleRemove,
    handleAddMember,
    handleAddChart,
    handleRemoveChart,
    handleDeleteGroup,
    handleMenuOpen,
    handleMenuClose,
    showChartPicker,
    setShowChartPicker,
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
          <span></span><span></span><span></span><span></span>
        </button>
        <button
          id="graphControl"
          onClick={() => handleButtonClick('graphControl')}
          className={activeButton === 'graphControl' ? styles.filterActive : ''}
        >
          群組可視圖表
          <span></span><span></span><span></span><span></span>
        </button>
      </div>

      <div className={styles.theTable}>
        {activeButton === 'memberControl' && (
          <>
            <Button
              onClick={() => setShowMemberPicker(true)}
              className={styles.addButton}
            >
              新增成員
            </Button>
            <Button
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
              sx={{
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <img src={moreInfo} className={styles.moreIcon} alt="操作" />
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
                            onClick={() => handleRemove(member.userId, member.userName)}
                            className={styles.removeButton}
                          >
                            移除
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4}>查無成員</td></tr>
                  )}
                </tbody>

              </table>
            </div>
          </>
        )}

        {activeButton === 'graphControl' && (
          <>
            <Button
              onClick={() => setShowChartPicker(true)}
              className={styles.addButton}
            >
              新增圖表
            </Button>
            <IconButton
              aria-label="更多操作"
              aria-controls="long-menu2"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              className={styles.dropdownButton}
              sx={{
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <img src={moreInfo} className={styles.moreIcon} alt="操作" />
            </IconButton>
            <Menu
              id="long-menu2"
              anchorEl={anchorEl}
              keepMounted
              open={isMenuOpen}
              onClose={handleMenuClose}
              className={styles.dropdownMenu}
            >
              <MenuItem onClick={() => { setShowChartPicker(true); handleMenuClose(); }}>新增圖表</MenuItem>
            </Menu>

            {showChartPicker && (
              <ChartPickerDialog
                open={showChartPicker}
                onClose={() => setShowChartPicker(false)}
                onAdd={handleAddChart}
                charts={allCharts}
              />
            )}
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
                          <Button
                            variant="outlined"
                            onClick={() => handleRemoveChart(chart.id)}
                            className={styles.removeButton}
                          >
                            移除
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={2}>查無圖表</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GroupList;
