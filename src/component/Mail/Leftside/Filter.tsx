//src\component\Mail\Leftside\Filter.tsx
import React from 'react';
import "../../../styles/filter.css";

// 状态映射
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
  // 状态数组
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);

  // 处理选中的状态
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;
    const status = Object.keys(statusMapping).find(key => statusMapping[key] === id);

    if (status) {
      setSelectedStatuses(prevStatuses => {
        const updatedStatuses = checked
          ? [...prevStatuses, status]
          : prevStatuses.filter(item => item !== status);

        onFilterChange(updatedStatuses); // 调用 onFilterChange 并传递更新后的状态数组
        return updatedStatuses;
      });
    }
  };

  return (
    <div className="filter">
      {Object.keys(statusMapping).map((label) => (
        <div className="options" key={statusMapping[label]}>
          <input 
            type="checkbox" 
            name="taskStatus" 
            id={statusMapping[label]} 
            value={statusMapping[label]} 
            onChange={handleCheckboxChange} 
          />
          <label htmlFor={statusMapping[label]}>{label}</label>
        </div>
      ))}
    </div>
  );
};

export default Filter;
