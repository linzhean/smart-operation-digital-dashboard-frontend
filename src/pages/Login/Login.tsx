import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../component/Login/LoginForm';
import { backendApiUrl, clientId } from '../../services/api';
import { fetchUserData, updateUserData } from '../../services/api';
import '../../styles/global.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [logoutMessage, setLogoutMessage] = useState<string>("");

  const onSuccess = async (credentialResponse: any) => {
    try {
      console.log("LOGIN SUCCESS! Current user:", credentialResponse);

      const idToken = credentialResponse.credential;
      console.log("Google ID Token:", idToken);

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      const decodedToken = jwtDecode(idToken);
      console.log("Decoded Token:", decodedToken);

      const userId = decodedToken.sub;

      const res = await fetch(`${backendApiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Token': idToken,
        },
        body: JSON.stringify({
          userId: userId,
          idToken: idToken,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to login: ${res.statusText}`);
      }

      const data = await res.json();
      console.log('Login to backend successful:', data);

      const authToken = res.headers.get('x-auth-token');
      if (authToken) {
        localStorage.setItem('authToken', authToken);
        navigate('/main'); // 导航到主页面
      } else {
        console.error('No auth token received from backend');
        setError('No auth token received from backend');
      }
    } catch (error) {
      console.error('An error occurred during the login request:', error);
      setError('An error occurred during the login request. Please try again.');
    }
  };

  const onFailure = () => {
    console.error("LOGIN FAILED!");
    alert("登录失败，请稍后再试。");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <LoginForm error={error} onSuccess={onSuccess} onFailure={onFailure} />
    </GoogleOAuthProvider>
  );
};

export default Login;
