// src/context/UserContext.tsx
import React, { createContext, useReducer, ReactNode, useContext, useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { backendApiUrl } from '../services/LoginApi';

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
    modifyDate: '',
  },
  loading: true,
  editable: false,
  isAuthenticated: false,
};

type State = typeof initialState;

type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_FORM_DATA'; payload: FormData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_EDITABLE'; payload: boolean }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'UPDATE_FORM_DATA'; payload: { id: string; value: string } };

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

  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      dispatch({ type: 'SET_USER', payload: user });
    } else {
      dispatch({ type: 'CLEAR_USER' });
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      fetchWithAuth(`${backendApiUrl}/user-account`)
        .then((response) => response.json())
        .then((data) => {
          setUser(data.data);
          dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        })
        .catch((error) => {
          console.error('Failed to fetch user data:', error);
          dispatch({ type: 'SET_AUTHENTICATED', payload: false });
        });
    } else {
      dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    }
  }, []);  

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
