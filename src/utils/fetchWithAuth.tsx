// src/utils/fetchWithAuth.ts
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<any> => {
  const authToken = localStorage.getItem('authToken'); // 从本地存储中获取后端返回的 token

  const headers = new Headers(options.headers || {});

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  const updatedOptions: RequestInit = {
    ...options,
    headers: headers,
  };

  const response = await fetch(url, updatedOptions);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
