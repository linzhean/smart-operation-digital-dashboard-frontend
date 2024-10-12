//src\component\AssignExportControl\KPIAlertSetting.tsx
import React, { useEffect, useState } from 'react';
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
  name: string;
}

export default function KPIAlertSetting({ onClose, chartName, upperLimit, lowerLimit, setUpperLimit, setLowerLimit, defaultProcessor, defaultAuditor, onSubmit, chartId }: KPIAlertSettingProps) {

  const [value, setValue] = React.useState<number[]>([lowerLimit || 1, upperLimit || 1000]);
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
        console.log(data);
        if (Array.isArray(data.data)) {
          setCharts(data.data);
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
      console.log('Fetched Users:', data);
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

  const handleInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(event.target.value);
    if (index === 0) {
      setValue([inputValue, value[1]]);
      setLowerLimit(inputValue);
    } else {
      setValue([value[0], inputValue]);
      setUpperLimit(inputValue);
    }
  };

  const handleBlur = () => {
    setLowerLimit(value[0]);
    setUpperLimit(value[1]);
  };

  const handleConfirm = () => {
    const lower = parseFloat(value[0].toString());
    const upper = parseFloat(value[1].toString());

    setLowerLimit(lower);
    setUpperLimit(upper);

    if (selectedProcessor && selectedAuditor) {
      onSubmit(lower, upper, selectedProcessor.userId, selectedAuditor.userId, chartId);
    }
    onClose();
  };

  return (
    <div className={styles.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) { onClose(); } }}>
      <div className={styles.settingAlert}>
        <h2>{chartName}警訊</h2>
        <div className={`${styles.descriptionText} ${styles.firstline}`}>若數值超過此區間</div>
        <div className={styles.descriptionText}>系統會發送異常信件通知您</div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mt: 2,
            justifyContent: 'center',
            '@media (min-width: 1200px)': {
              marginTop: '22px',
            },
            '@media (min-width: 600px) and (max-width: 1199px)': {
              marginTop: '16px',
            },
          }}
        >
          <div className={styles.theText}>
            <p className={styles.textField}>
              最低值
            </p>
            <p className={styles.textField}>
              最高值
            </p>
          </div>
          {/* <div className={styles.theBox}>
            <div className={styles.theNumberBox}>
              <TextField
                type="number"
                value={value[0]}
                onChange={handleInputChange(0)}
                onBlur={handleBlur}
                inputProps={{
                  min: 0,
                  max: value[1] - minDistance,
                }}
                InputLabelProps={{
                  sx: {
                    color: 'black',
                    fontWeight: 600,
                    '&.Mui-focused': {
                      color: '#000',
                    },
                  },
                }}
                InputProps={{
                  sx: {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'black',
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            </div>
            <div className={styles.theNumberBox}>
              <TextField
                type="number"
                value={value[1]}
                onChange={handleInputChange(1)}
                onBlur={handleBlur}
                inputProps={{
                  min: 0,
                }}
                InputLabelProps={{
                  sx: {
                    color: 'black',
                    fontWeight: 600,
                    '&.Mui-focused': {
                      color: '#000',
                    },
                  },
                }}
                InputProps={{
                  sx: {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'black',
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            </div>
          </div> */}

          <div className={styles.theBox}>
            <div className={styles.theNumberBox}>
              <TextField
                type="number"
                value={value[0]}
                onChange={handleInputChange(0)}
                onBlur={handleBlur}
                inputProps={{
                  min: 0,
                  max: value[1] - minDistance,
                }}
                sx={{ width: '100%' }}
                InputLabelProps={{
                  sx: {
                    color: 'black',
                    fontWeight: 600,
                    '&.Mui-focused': {
                      color: '#000',
                    },
                  },
                }}
                InputProps={{
                  sx: {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'black',
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            </div>
            <div className={styles.theNumberBox}>
              <TextField
                type="number"
                value={value[1]}
                onChange={handleInputChange(1)}
                onBlur={handleBlur}
                inputProps={{
                  min: 0,
                }}
                sx={{ width: '100%' }}
                InputLabelProps={{
                  sx: {
                    color: 'black',
                    fontWeight: 600,
                    '&.Mui-focused': {
                      color: '#000',
                    },
                  },
                }}
                InputProps={{
                  sx: {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'black',
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            </div>
          </div>

        </Box>
        <div className={styles.theUserPickerBox}>
          <Autocomplete
            className={styles.autocomplete}
            value={selectedProcessor || { id: 0, userId: '', userName: defaultProcessor, groupId: 0, name: defaultProcessor, department: '', position: '', userGroupId: 0, available: true, createId: '', createDate: '', modifyId: '', modifyDate: '' }}
            options={users}
            getOptionLabel={(option) => option.userName}
            onChange={(event, newValue) => setSelectedProcessor(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="選擇處理者" />
            )}
          />
        </div>
        <div className={styles.theUserPickerBox}>
          <Autocomplete
            className={styles.autocomplete}
            value={selectedAuditor || { id: 0, userId: '', userName: defaultAuditor, groupId: 0, name: defaultAuditor, department: '', position: '', userGroupId: 0, available: true, createId: '', createDate: '', modifyId: '', modifyDate: '' }}
            options={users}
            getOptionLabel={(option) => option.userName}
            onChange={(event, newValue) => setSelectedAuditor(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="選擇稽核者" />
            )}
          />
        </div>

        {/* </Box> */}
        <div className={styles.buttonGroup}>
          <button className={styles.cancel} onClick={onClose}>取消</button>
          <button className={styles.submit} onClick={handleConfirm}>確定</button>
        </div>
      </div>
    </div>
  );
}
