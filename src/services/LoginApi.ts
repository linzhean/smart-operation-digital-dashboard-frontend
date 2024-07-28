// src/services/LoginApi.ts
export const backendApiUrl = "http://140.131.115.153:8080";
export const clientId = "629445899576-8mdmcg0etm5r7i28dk088fas2o3tjpm0.apps.googleusercontent.com";

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
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};