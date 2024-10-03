//src\component\AssignExportControl\KPIAlertSetting.tsx
import React, { useEffect, useState } from 'react';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import styles from './KPIAlertSetting.module.css';
import { fetchAllUsers } from '../../services/UserAccountService';
import { UserAccountBean, User } from '../../services/types/userManagement';
import { Autocomplete } from '@mui/material';
import ChartService from '../../services/ChartService';
import { Chart } from 'chart.js';

const minDistance = 1;

interface KPIAlertSettingProps {
  onClose: () => void;
  chartName: string | null;
  upperLimit: number;
  lowerLimit: number;
  setUpperLimit: (value: number) => void;
  setLowerLimit: (value: number) => void;
  onSubmit: (lowerLimit: number, upperLimit: number, defaultProcessor: string, defaultAuditor: string, chartId: number) => void; // 添加 chartId 参数
}

interface CustomChart extends Chart {
  name: string; // Add other properties if needed
}

export default function KPIAlertSetting({ onClose, chartName, upperLimit, lowerLimit, setUpperLimit, setLowerLimit, onSubmit }: KPIAlertSettingProps) {

  const [value, setValue] = React.useState<number[]>([lowerLimit, upperLimit]);
  const [users, setUsers] = useState<User[]>([]);
  const [defaultProcessor, setDefaultProcessor] = useState<User | null>(null);
  const [defaultAuditor, setDefaultAuditor] = useState<User | null>(null);
  const [charts, setCharts] = useState<CustomChart[]>([]);
  const [selectedChart, setSelectedChart] = useState<Chart | null>(null);

  useEffect(() => {
    ChartService.getAllCharts()
      .then((data) => {
        console.log(data); // 檢查數據
        if (Array.isArray(data.data)) { // 確保訪問到正確的屬性
          setCharts(data.data); // 將這行改為 data.data
        } else {
          console.error('Expected an array for charts, but got:', data);
          setCharts([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching charts', error);
        setCharts([]);
      });
  }, []);
  
  
  useEffect(() => {
    fetchAllUsers()
      .then((data) => {
        const userList: User[] = data.map((user: UserAccountBean) => ({
          id: user.id || 0,
          groupId: user.groupId || 0,
          userId: user.userId,
          name: user.userName,
          userName: user.userName,
          department: user.departmentName,
          position: user.position,
          userGroupId: user.userGroupId || 0,
          available: user.available === true,
          createId: user.createId,
          createDate: user.createDate,
          modifyId: user.modifyId,
          modifyDate: user.modifyDate,
        }));
        setUsers(userList);
      })
      .catch((error) => {
        console.error('Error fetching users', error);
        setUsers([]); // Reset to empty array on error
      });
  }, []);  

  const handleSliderChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setValue([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setValue([clamped - minDistance, clamped]);
      }
    } else {
      setValue(newValue as number[]);
    }
  };

  const handleInputChange = (index: number) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = Number(event.target.value);
    if (index === 0) {
      const clampedValue = Math.min(inputValue, value[1] - minDistance);
      setValue([clampedValue, value[1]]);
      setLowerLimit(clampedValue);  // 更新父組件的狀態
    } else {
      const clampedValue = Math.max(inputValue, value[0] + minDistance);
      setValue([value[0], clampedValue]);
      setUpperLimit(clampedValue);  // 更新父組件的狀態
    }
  };

  const handleBlur = () => {
    setLowerLimit(value[0]);
    setUpperLimit(value[1]);
  };

  const handleConfirm = () => {
    setLowerLimit(value[0]);
    setUpperLimit(value[1]);
    if (defaultProcessor && defaultAuditor && selectedChart) {
      onSubmit(value[0], value[1], defaultProcessor.userId, defaultAuditor.userId,  Number(selectedChart.id)); // 传递 chartId
    }
    onClose();
  };  

  return (
    <div className={styles.settingAlert}>
      <h2>{`${chartName}警訊`}</h2>
      <div className={`${styles.descriptionText} ${styles.firstline}`}>若數值超過此區間</div>
      <div className={styles.descriptionText}>系統會發送異常信件通知您</div>
      <Box
        sx={{
          width: 200,
          '@media (min-width: 1200px)': {
            width: '350px',
            position: 'fixed',
            top: '57%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease',
          },
          '@media (min-width: 600px) and (max-width: 1199px)': {
            width: '300px',
            position: 'fixed',
            top: '57%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease',
          },
        }}
      >
        <Slider
          value={value}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          disableSwap
          min={0}
          max={100}
          sx={{
            color: '#000000',
            height: 8,
            '& .MuiSlider-track': {
              border: 'none',
            },
            '& .MuiSlider-thumb': {
              height: 24,
              width: 24,
              backgroundColor: '#fff',
              border: '2px solid currentColor',
              '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                boxShadow: 'inherit',
              },
              '&::before': {
                display: 'none',
              },
            },
            '& .MuiSlider-valueLabel': {
              lineHeight: 1.2,
              fontSize: 20,
              background: 'unset',
              padding: 0,
              width: 38,
              height: 38,
              color: '#CCC',
              fontWeight: 700,
              borderRadius: '50% 50% 50% 0',
              backgroundColor: '#000000',
              transformOrigin: 'bottom left',
              transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
              '&::before': { display: 'none' },
              '&.MuiSlider-valueLabelOpen': {
                transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
              },
              '& > *': {
                transform: 'rotate(45deg)',
              },
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            mt: 2,
            gap: '18px',
            justifyContent: 'center',
            '@media (min-width: 1200px)': {
              marginTop: '22px',
              gap: '55px',

            },
            '@media (min-width: 600px) and (max-width: 1199px)': {
              marginTop: '22px',
              gap: '40px',
            },
          }}
        >
          <TextField
            label="最低"
            value={value[0]}
            onChange={handleInputChange(0)}
            onBlur={handleBlur}
            inputProps={{
              min: 0,
              max: value[1] - minDistance,
              type: 'number',
            }}
            InputLabelProps={{
              sx: {
                color: 'black',
                fontWeight: 700,
                '&.Mui-focused': {
                  color: '#000',
                },
              },
            }}
            InputProps={{
              sx: {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'black',
                  borderWidth: '3px',
                },
              },
            }}
          />
          <TextField
            label="最高"
            value={value[1]}
            onChange={handleInputChange(1)}
            onBlur={handleBlur}
            inputProps={{
              min: value[0] + minDistance,
              max: 100,
              type: 'number',
            }}
            InputLabelProps={{
              sx: {
                color: 'black',
                fontWeight: 700,
                '&.Mui-focused': {
                  color: '#000',
                },
              },
            }}
            InputProps={{
              sx: {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'black',
                  borderWidth: '3px',
                },
              },
            }}
          />
        </Box>
        {/* 添加 defaultProcessor 下拉选择 */}
        <Autocomplete
          className={styles.autocomplete}
          options={users} // Should be an array
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => {
            setDefaultProcessor(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="選擇處理者" variant="outlined" />
          )}
        />
        <Autocomplete
          className={styles.autocomplete} // 添加類名以適用樣式
          options={users}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => {
            setDefaultAuditor(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="選擇稽核者" variant="outlined" />
          )}
        />
        <Autocomplete
          className={styles.autocomplete}
          options={charts}
          getOptionLabel={(option) => option.name} // 假设 Chart 对象有 name 属性
          onChange={(event, newValue) => {
            setSelectedChart(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="選擇圖表" variant="outlined" />
          )}
        />
      </Box>
      <div className={styles.buttonGroup}>
        <button className={styles.cancel} onClick={onClose}>取消</button>
        <button className={styles.submit} onClick={handleConfirm}>確定</button>
      </div>
    </div >
  );
}
