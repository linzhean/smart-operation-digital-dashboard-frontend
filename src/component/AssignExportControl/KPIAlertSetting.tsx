import * as React from 'react';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import styles from './KPIAlertSetting.module.css';

const minDistance = 1;

interface KPIAlertSettingProps {
  onClose: () => void;
}

export default function KPIAlertSetting({ onClose }: KPIAlertSettingProps) {
  const [value, setValue] = React.useState<number[]>([20, 50]);

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
    } else {
      const clampedValue = Math.max(inputValue, value[0] + minDistance);
      setValue([value[0], clampedValue]);
    }
  };

  const handleBlur = () => {
    if (value[0] < 0) {
      setValue([0, value[1]]);
    }
    if (value[1] > 100) {
      setValue([value[0], 100]);
    }
  };

  return (
    <div className={styles.settingAlert}>
      <h2>設定警訊數值</h2>
      <div className={styles.descriptionText}>當數值超過此區間會引發警訊</div>
      <Box sx={{ width: 200 }}>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: '18px' }}>
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
      </Box>
      <div className={styles.buttonGroup}>
        <button className={styles.cancel} onClick={onClose}>取消</button>
        <button className={styles.submit}>確定</button>
      </div>
    </div >
  );
}
