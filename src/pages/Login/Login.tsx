import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../component/Login/LoginForm';
import { backendApiUrl, clientId } from '../../services/LoginApi';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const onSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      const decodedToken: any = jwtDecode(idToken);
      const userId = decodedToken.sub;

      const res = await fetch(`${backendApiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Token': idToken,
        },
        body: JSON.stringify({ userId, idToken }),
      });

      if (!res.ok) {
        throw new Error(`Failed to login: ${res.statusText}`);
      }

      const authToken = res.headers.get('x-auth-token');
      const userHasProfile = res.headers.get('x-user-has-profile') === 'true';

      if (authToken) {
        localStorage.setItem('authToken', authToken);
        if (userHasProfile) {
          navigate('/awaiting-approval');
        } else {
          navigate('/profile-setup');
        }
      } else {
        setError('No auth token received from backend');
      }
    } catch (error) {
      setError('An error occurred during the login request. Please try again.');
    }
  };

  const onFailure = () => {
    alert("登錄失敗，請稍後再嘗試。");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <LoginForm error={error} onSuccess={onSuccess} onFailure={onFailure} />
    </GoogleOAuthProvider>
  );
};

export default Login;
