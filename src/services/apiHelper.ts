// src/services/apiHelper.ts
export const getHeaders = () => {
  const authToken = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };
};
