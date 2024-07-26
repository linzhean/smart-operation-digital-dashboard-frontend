import React, { createContext, useContext, useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.sub;
        const userName = decodedToken.name;
        const userEmail = decodedToken.email;
        const userRole = decodedToken.role;

        setUser({ id: userId, name: userName, email: userEmail, role: userRole });
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
