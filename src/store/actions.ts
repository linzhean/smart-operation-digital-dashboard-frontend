// src/store/actions.ts
export const SET_USER_DATA = 'SET_USER_DATA';

export const setUserData = (userData: any) => ({
  type: SET_USER_DATA,
  payload: userData
});
