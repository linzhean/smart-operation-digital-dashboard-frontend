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
  defaultProcessor: string;
  defaultAuditor: string;
  onSubmit: (lowerLimit: number, upperLimit: number, defaultProcessor: string, defaultAuditor: string, chartId: number) => void; // 添加 chartId 参数
  chartId: number;
}

interface CustomChart extends Chart {
  name: string; // Add other properties if needed
}

export default function KPIAlertSetting({ onClose, chartName, upperLimit, lowerLimit, setUpperLimit, setLowerLimit, defaultProcessor, defaultAuditor, onSubmit, chartId }: KPIAlertSettingProps) {

  const [value, setValue] = React.useState<number[]>([lowerLimit || 1, upperLimit || 100]); // 設置初始默認值
  const [users, setUsers] = useState<User[]>([]);
  const [selectedProcessor, setSelectedProcessor] = useState<User | null>(null);
  const [selectedAuditor, setSelectedAuditor] = useState<User | null>(null);
  const [charts, setCharts] = useState<CustomChart[]>([]);

  useEffect(() => {
    console.log('Received upperLimit:', upperLimit, 'lowerLimit:', lowerLimit);
  }, [upperLimit, lowerLimit]);

  useEffect(() => {
    console.log('Lower Limit:', lowerLimit);
    console.log('Upper Limit:', upperLimit);
    setValue([lowerLimit, upperLimit]);
  }, [lowerLimit, upperLimit]);

  useEffect(() => {
    console.log('Users:', users);
    console.log('Default Processor:', defaultProcessor);
    console.log('Default Auditor:', defaultAuditor);

    if (users.length > 0) {
      const processorUser = users.find(user => user.userId === defaultProcessor) || null;
      const auditorUser = users.find(user => user.userId === defaultAuditor) || null;

      setSelectedProcessor(processorUser);
      setSelectedAuditor(auditorUser);
    }
  }, [defaultProcessor, defaultAuditor, users]);

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
    fetchAllUsers().then((data: UserAccountBean[]) => {
      console.log('Fetched Users:', data); // 確認數據是否正確
      const mappedUsers: User[] = data.map((user) => ({
        id: Number(user.userId),
        userId: user.userId,
        userName: user.userName,
        groupId: user.userGroupId,
        name: user.userName,
        department: user.departmentName || '',
        position: user.position,
        userGroupId: user.userGroupId,
        available: user.available,
        createId: user.createId,
        createDate: user.createDate,
        modifyId: user.modifyId,
        modifyDate: user.modifyDate,
      }));

      setUsers(mappedUsers);

      const processorUser = mappedUsers.find(user => user.id === Number(defaultProcessor)) || null;
      const auditorUser = mappedUsers.find(user => user.id === Number(defaultAuditor)) || null;

      setSelectedProcessor(processorUser);
      setSelectedAuditor(auditorUser);
    });
  }, [defaultProcessor, defaultAuditor]);

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

  const handleInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(event.target.value);
    if (index === 0) {
      const clampedValue = Math.min(inputValue, value[1] - minDistance);
      setValue([clampedValue, value[1]]);
      setLowerLimit(clampedValue);  // Update parent component's state
    } else {
      const clampedValue = Math.max(inputValue, value[0] + minDistance);
      setValue([value[0], clampedValue]);
      setUpperLimit(clampedValue);  // Update parent component's state
    }
  };

  const handleBlur = () => {
    setLowerLimit(value[0]);
    setUpperLimit(value[1]);
  };

  const handleConfirm = () => {
    setLowerLimit(value[0]);
    setUpperLimit(value[1]);
    if (selectedProcessor && selectedAuditor) {
      onSubmit(value[0], value[1], selectedProcessor.userId, selectedAuditor.userId, chartId);
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
          max={1000}
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
            type="number"
            value={value[0]}   // 綁定到 lowerLimit
            onChange={handleInputChange(0)}
            onBlur={handleBlur}
            inputProps={{
              min: 0,
              max: value[1] - minDistance,
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
            label="最高值"
            type="number"
            value={value[1]}  // 綁定到 upperLimit
            onChange={handleInputChange(1)}
            onBlur={handleBlur}
            inputProps={{
              min: value[0] + minDistance,
              max: 100,
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
          value={selectedProcessor || { id: 0, userId: '', userName: defaultProcessor, groupId: 0, name: defaultProcessor, department: '', position: '', userGroupId: 0, available: true, createId: '', createDate: '', modifyId: '', modifyDate: '' }}
          options={users}
          getOptionLabel={(option) => option.userName}
          onChange={(event, newValue) => setSelectedProcessor(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="選擇處理者" variant="outlined" />
          )}
        />

        <Autocomplete
          className={styles.autocomplete}
          value={selectedAuditor || { id: 0, userId: '', userName: defaultAuditor, groupId: 0, name: defaultAuditor, department: '', position: '', userGroupId: 0, available: true, createId: '', createDate: '', modifyId: '', modifyDate: '' }}
          options={users}
          getOptionLabel={(option) => option.userName}
          onChange={(event, newValue) => setSelectedAuditor(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="選擇稽核者" variant="outlined" />
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
