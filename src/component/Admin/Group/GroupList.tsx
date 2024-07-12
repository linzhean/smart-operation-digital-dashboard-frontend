import React, { useEffect, useState } from 'react';
import { Group } from '../../../services/types/userManagement'; 
import { fetchGroups } from '../../../services/GroupApi'; 

interface GroupListProps {
  onSelectGroup: (groupId: number) => void;
}

const GroupList: React.FC<GroupListProps> = ({ onSelectGroup }) => {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroupsData = async () => {
      try {
        const fetchedGroups = await fetchGroups(); 
        setGroups(fetchedGroups);
      } catch (error) {
        console.error('獲取群組失敗:', error);
      }
    };

    fetchGroupsData();
  }, []);

  return (
    <div className="group-list">
      <h3>群組列表</h3>
      <ul>
        {groups.map(group => (
          <li key={group.id} onClick={() => onSelectGroup(group.id)}>
            {group.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;
