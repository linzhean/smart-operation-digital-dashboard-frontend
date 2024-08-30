// NewChartForm.tsx
import React, { useState } from 'react';
import styles from './newChartForm.module.css';
import { Button, IconButton, Avatar, Stack, Typography } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ImgIcon from '../../assets/icon/image.png'
interface NewChartFormProps {
  onSubmit: (chartName: string, chartCode: string, chartImage: string) => void;
  onClose: () => void;
}

const NewChartForm: React.FC<NewChartFormProps> = ({ onSubmit, onClose }) => {
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };


  const [chartName, setChartName] = useState('');
  const [chartCode, setChartCode] = useState('');
  const [chartImage, setChartImage] = useState('');

  const handleSubmit = () => {
    onSubmit(chartName, chartCode, chartImage);
    onClose();
  };

  return (
    <div>
      <div className={styles.formOverlay} onClick={onClose}></div>
      <div onClick={(e) => e.stopPropagation()} className={styles.checkFormContent}>
        <h2>新增圖表</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.newKPIlabelGroup}>
            <label htmlFor='newKpiName'>圖表名稱</label>
            <input
              id='newKpiName'
              type="text"
              value={chartName}
              className={styles.newKpiNameInput}
              onChange={(e) => setChartName(e.target.value)}
            />
          </div>

          <div className={styles.newKPIlabelGroup}>
            <label htmlFor='newKpiCode'>圖表程式碼</label>
            <textarea
              className={styles.newKpiCode}
              placeholder='請輸入程式碼'
              id='newKpiCode'
              required
              value={chartCode}
              onChange={(e) => setChartCode(e.target.value)}
            />
          </div>

          <div className={styles.newKpiImgGroup}>
            <label htmlFor="uploadButton">圖表示意圖上傳</label>
            <Stack id='newKpiImg'>
              {image ? (
                <Avatar
                  alt="上傳示意圖"
                  src={image}
                  sx={{ width: 100, height: 100, border: '2px solid #1976d2' }}
                />
              ) : (
                <label htmlFor="uploadButton" style={{ cursor: 'pointer' }}>
                  <input
                    accept="image/*"
                    id="uploadButton"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                  <img src={ImgIcon} className={styles.ImgIcon} alt="" />
                </label>
              )}
            </Stack>
          </div>


          <div className={styles.newKPIbuttonGroup}>
            <button onClick={onClose} className={styles.cancel}>取消</button>
            <button onClick={handleSubmit} className={styles.submit}>提交</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChartForm;
