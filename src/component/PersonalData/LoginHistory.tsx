import React from 'react';
import styles from './LoginHistory.module.css';

interface LoginRecord {
  date: string;
  time: string;
  ipAddress: string;
  device: string;
  region: string;
}

const records: LoginRecord[] = [
  { date: '2024-07-21', time: '12:34:56', ipAddress: '192.168.0.1', device: '桌面電腦', region: '台北市' },
  { date: '2024-07-20', time: '11:22:33', ipAddress: '192.168.0.2', device: '手機', region: '新北市' },
  { date: '2024-07-19', time: '10:11:22', ipAddress: '192.168.0.3', device: '平板', region: '台中市' },
];

const LoginHistory: React.FC = () => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>日期</th>
          <th>時間</th>
          <th>IP位置</th>
          <th>裝置</th>
          <th>地點</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record, index) => (
          <tr key={index}>
            <td>{record.date}</td>
            <td>{record.time}</td>
            <td>{record.ipAddress}</td>
            <td>{record.device}</td>
            <td>{record.region}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LoginHistory;
