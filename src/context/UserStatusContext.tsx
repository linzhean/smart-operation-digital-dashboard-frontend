//src\context\UserStatusContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  department: string;
  email: string;
  status: string;
  position: string;
}

interface UserStatusContextType {
  users: User[];
  addUser: (user: User) => void;
}

const UserStatusContext = createContext<UserStatusContextType | undefined>(undefined);

export const useUserStatus = (): UserStatusContextType => {
  const context = useContext(UserStatusContext);
  if (!context) {
    throw new Error('useUserStatus must be used within a UserStatusProvider');
  }
  return context;
};

export const UserStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);

  const addUser = (user: User) => {
    setUsers(prevUsers => [...prevUsers, user]);
  };

  return (
    <UserStatusContext.Provider value={{ users, addUser }}>
      {children}
    </UserStatusContext.Provider>
  );
};
