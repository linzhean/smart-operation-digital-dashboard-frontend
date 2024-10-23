import React from 'react';
import styles from "./filter.module.css";

const statusMapping: Record<string, string> = {
  "交辦": "0",
  "被交辦": "1",
  "待處理": "2",
  "已完成": "3",
};

interface FilterProps {
  onFilterChange: (status: string[]) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSelectedStatus(value);
    onFilterChange([value]); 
  };


  return (
    <div className={styles.EmailFilter}>
      {Object.entries(statusMapping).map(([label, statusCode]) => (
        <div className={styles.EmailFilterOptions} key={statusCode}>
          <input
            type="checkbox"
            name="taskStatus"
            id={statusCode}
            value={statusCode}
            checked={selectedStatus === statusCode}
            onChange={handleRadioChange}
          />
          <label htmlFor={statusCode}>{label}</label>
        </div>
      ))}
    </div>
  );
};

export default Filter;
