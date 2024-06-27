import React from 'react';
import '../../styles/Admin/adminDrawerNavigation.css';

interface AdminDrawerNavigationProps {
    tabs: string[];
    onAddTab: () => void;
    onDeleteTab: (index: number) => void;
    isOpen: boolean;
    toggleDrawer: () => void;
}

const AdminDrawerNavigation: React.FC<AdminDrawerNavigationProps> = ({ tabs, onAddTab, onDeleteTab, isOpen, toggleDrawer }) => {
    return (
        <div className={`admin-drawer-navigation ${isOpen ? 'open' : 'closed'}`}>
            <button onClick={toggleDrawer}>Toggle Drawer</button>
            <ul>
                {tabs.map((tab, index) => (
                    <li key={index}>
                        {tab}
                        <button onClick={() => onDeleteTab(index)}>Delete</button>
                    </li>
                ))}
            </ul>
            <button onClick={onAddTab}>Add Tab</button>
        </div>
    );
};

export default AdminDrawerNavigation;
