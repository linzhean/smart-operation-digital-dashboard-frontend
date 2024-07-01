// src/store/reducers.ts
import { SET_USER_DATA } from './actions';

const initialState = {
  user: {
    name: '',
    num: '',
    email: '',
    unit: '',
    role: ''
  }
};

const rootReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
};

export default rootReducer;
