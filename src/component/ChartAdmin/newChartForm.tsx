import React, { useState } from 'react';
import styles from './newChartForm.module.css';
import { Avatar, Stack } from '@mui/material';
import ImgIcon from '../../assets/icon/image.png';
import PythonIcon from '../../assets/icon/code.png';

interface NewChartFormProps {
  onSubmit: (chartName: string, chartCode: File | null, chartImage: string | null) => void;
  onClose: () => void;
}

const NewChartForm: React.FC<NewChartFormProps> = ({ onSubmit, onClose }) => {
  const [image, setImage] = useState<string | null>(null);
  const [chartName, setChartName] = useState('');
  const [newCodeFile, setNewCodeFile] = useState<File | null>(null);

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

  const handleNewCodeFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setNewCodeFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(chartName, newCodeFile, image);
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
              autoComplete='off'
              placeholder='請輸入新圖表的名稱'
              id='newKpiName'
              type="text"
              value={chartName}
              className={styles.newKpiNameInput}
              onChange={(e) => setChartName(e.target.value)}
            />
          </div>

          <div className={styles.newKpiCodeGroup}>
            <Stack id='newKpiCode'>
              {newCodeFile ? (
                <>
                  <p
                    className={styles.newCodeFile}
                    onClick={() => document.getElementById('newKpiCodeuploadButton')?.click()}
                  >
                    {newCodeFile.name}
                  </p>
                  <input
                    accept=".py"
                    id="newKpiCodeuploadButton"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleNewCodeFileChange}
                  />
                </>
              ) : (
                <div className={styles.newCodeContainer}>
                  <label htmlFor="newKpiCodeuploadButton">圖表程式碼上傳</label>
                  <label htmlFor="newKpiCodeuploadButton" style={{ cursor: 'pointer' }}>
                    <input
                      accept=".py"
                      id="newKpiCodeuploadButton"
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleNewCodeFileChange}
                    />
                    <img src={PythonIcon} className={styles.CodeIcon} alt="程式碼圖標" />
                  </label>
                </div>
              )}
            </Stack>
          </div>

          <div className={styles.newKpiImgGroup}>
            <Stack id='newKpiImg'>
              {image ? (
                <>
                  <Avatar
                    alt="上傳示意圖"
                    src={image}
                    sx={{
                      width: 180,
                      height: 180,
                      border: 'none',
                      borderRadius: '10px',
                      display: 'block',
                      cursor: 'pointer',
                    }}
                    onClick={() => document.getElementById('uploadButton')?.click()}
                  />
                  <input
                    accept="image/*"
                    id="uploadButton"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                </>
              ) : (
                <div className={styles.newImgContainer}>
                  <label htmlFor="uploadButton">圖表示意圖上傳</label>
                  <label htmlFor="uploadButton" style={{ cursor: 'pointer' }}>
                    <input
                      accept="image/*"
                      id="uploadButton"
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                    <img src={ImgIcon} className={styles.ImgIcon} alt="圖片圖標" />
                  </label>
                </div>
              )}
            </Stack>
          </div>

          <div className={styles.newKPIbuttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancel}>取消</button>
            <button type="submit" className={styles.submit}>提交</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChartForm;
