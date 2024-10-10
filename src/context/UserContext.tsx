//src\context\UserContext.tsx
import React, { createContext, useReducer, ReactNode, useContext, useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { backendApiUrl } from '../services/LoginApi';
import { UpdateUserData } from '../services/types/userManagement';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  identity: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  state: State;
  dispatch: React.Dispatch<Action>;
  isAuthenticated: boolean;
}

interface State {
  formData: UpdateUserData;
  loading: boolean;
  editable: boolean;
  isAuthenticated: boolean;
}

type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_FORM_DATA'; payload: UpdateUserData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_EDITABLE'; payload: boolean }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'UPDATE_FORM_DATA'; payload: { id: string; value: string } };

const initialState: State = {
  formData: {
    userId: '',
    userName: '',
    departmentId: '',
    department:'',
    departmentName: '',
    googleId: '',
    gmail: '',
    identity: '',
    position: '',
    available: false,
    createId: '',
    createDate: '',
    modifyId: '',
    modifyDate: '',
    jobNumber: ''
  },
  loading: false,
  editable: false,
  isAuthenticated: false
};

const userReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
        isAuthenticated: true,
      };
    case 'CLEAR_USER':
      return initialState;
    case 'SET_FORM_DATA':
      return { ...state, formData: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_EDITABLE':
      return { ...state, editable: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, [action.payload.id]: action.payload.value },
      };
    default:
      return state;
  }
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    // 从 localStorage 恢复用户数据和 token
    const savedUser = localStorage.getItem('user');
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });

      if (savedUser) {
        setUserState(JSON.parse(savedUser));
        dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
      } else {
        // 如果未找到保存的用户，获取用户信息
        fetchWithAuth(`${backendApiUrl}/user-account`)
          .then((data) => {
            const userForContext: User = data.data;
            setUserState(userForContext);
            dispatch({ type: 'SET_USER', payload: userForContext });
            localStorage.setItem('user', JSON.stringify(userForContext)); // 保存用户数据
          })
          .catch(() => {
            dispatch({ type: 'SET_AUTHENTICATED', payload: false });
            localStorage.removeItem('authToken'); // 在错误时清除 token
          });
      }
    } else {
      dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    }

    // 清除 token 的 cleanup function
    return () => {
      localStorage.removeItem('authToken'); // 在组件卸载时清除 token
    };
  }, []);

  const setUser = (userData: any) => {
    if (userData) {
      const userForContext: User = { ...userData };
      setUserState(userForContext);
      dispatch({ type: 'SET_USER', payload: userForContext });
      localStorage.setItem('user', JSON.stringify(userForContext)); // 持久化用户数据
    } else {
      setUserState(null);
      dispatch({ type: 'CLEAR_USER' });
      localStorage.removeItem('user');
    }
  };

  const value = {
    user,
    setUser,
    state,
    dispatch,
    isAuthenticated: state.isAuthenticated,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
