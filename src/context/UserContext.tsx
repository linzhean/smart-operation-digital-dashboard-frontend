import React, { createContext, useReducer, ReactNode, useContext, useEffect } from 'react';
import { fetchUserData, updateUserData } from '../services/Pdata';

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

interface UserContextProps {
  state: State;
  dispatch: React.Dispatch<Action>;
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
  editable: false
};

type State = typeof initialState;

type Action =
  | { type: 'SET_FORM_DATA'; payload: FormData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_EDITABLE'; payload: boolean }
  | { type: 'UPDATE_FORM_DATA'; payload: { id: string; value: string } };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_FORM_DATA':
      return { ...state, formData: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_EDITABLE':
      return { ...state, editable: action.payload };
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, [action.payload.id]: action.payload.value }
      };
    default:
      return state;
  }
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  console.log('UserProvider rendered'); // Add this to see if UserProvider is being rendered
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await fetchUserData();
        dispatch({ type: 'SET_FORM_DATA', payload: data });
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadUserData();
  }, []);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
