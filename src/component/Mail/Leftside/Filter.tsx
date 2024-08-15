import React from 'react';
import "../../../styles/filter.css";

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
    const status = Object.keys(statusMapping).find(key => statusMapping[key] === id);
  
    if (status) {
      setSelectedStatuses(prevStatuses => {
        const updatedStatuses = checked
          ? [...prevStatuses, statusMapping[status]]
          : prevStatuses.filter(item => item !== statusMapping[status]);
  
        onFilterChange(updatedStatuses);
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
