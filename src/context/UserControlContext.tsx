// src/context/UserContext.tsx
import React, { createContext, useReducer, ReactNode, useContext, useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { backendApiUrl } from '../services/LoginApi';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  identity?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  state: State;
  dispatch: React.Dispatch<Action>;
  isAuthenticated: boolean;
}

interface FormData {
  userId: string;
  userName: string;
  departmentId: string;
  departmentName: string;
  googleId: string;
  gmail: string;
  identity: string;
  position: string;
  available: boolean;
  createId: string;
  createDate: string;
  modifyId: string;
  modifyDate: string;
}

const initialState = {
  formData: {
    userId: '',
    userName: '',
    departmentId: '',
    departmentName: '',
    googleId: '',
    gmail: '',
    identity: 'NO_PERMISSION',
    position: '',
    available: true,
    createId: '',
    createDate: '',
    modifyId: '',
    modifyDate: ''
  },
  loading: true,
  editable: false,
  isAuthenticated: false,
};

type State = typeof initialState;

type Action =
  | { type: 'SET_FORM_DATA'; payload: FormData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_EDITABLE'; payload: boolean }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'UPDATE_FORM_DATA'; payload: { id: string; value: string } };

function reducer(state: State, action: Action): State {
  switch (action.type) {
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
        formData: { ...state.formData, [action.payload.id]: action.payload.value }
      };
    default:
      return state;
  }
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await fetchWithAuth(`${backendApiUrl}/user-account`);
        const userData = await userResponse.json();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("获取用户详细信息失败", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    console.log("UserProvider rendered");
    console.log("User:", user);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, state, dispatch, isAuthenticated: state.isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext 必须在 UserProvider 内部使用');
  }
  return context;
};
