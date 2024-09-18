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
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;

    setSelectedStatuses(prevStatuses => {
      const updatedStatuses = checked
        ? [...prevStatuses, id]
        : prevStatuses.filter(statusId => statusId !== id);

      onFilterChange(updatedStatuses);
      return updatedStatuses;
    });
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
            onChange={handleCheckboxChange}
          />
          <label htmlFor={statusCode}>{label}</label>
        </div>
      ))}
    </div>
  );
};

export default Filter;
