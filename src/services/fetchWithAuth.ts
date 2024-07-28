// src/services/fetchWithAuth.ts
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<any> => {
    const authToken = localStorage.getItem('authToken');
  
    const headers = new Headers(options.headers || {});
  
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`);
    }
  
    const updatedOptions: RequestInit = {
      ...options,
      headers,
    };
  
    const response = await fetch(url, updatedOptions);
  
    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态: ${response.status}`);
    }
  
    return response.json();
  };
  