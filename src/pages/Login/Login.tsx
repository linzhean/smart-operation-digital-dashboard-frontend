import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../component/Login/LoginForm';
import { backendApiUrl, clientId } from '../../services/LoginApi';
import { useUserContext } from '../../context/UserContext';
import styles from './Login.module.css'
const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, dispatch } = useUserContext();
  const [error, setError] = useState<string>("");

  // 在组件挂载时检查用户的登录状态
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      navigate('/home'); // 如果已认证，则重定向到首页
    }
  }, [navigate]);

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
      if (authToken) {
        localStorage.setItem('authToken', authToken);
        
        const userResponse = await fetch(`${backendApiUrl}/user-account`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        const userData = await userResponse.json();
        
        const identityMapping: { [key: string]: string } = {
          '無權限': 'NO_PERMISSION',
          '一般使用者': 'USER',
          '開發者': 'DEVELOPER',
          '管理員': 'ADMIN'
        };
        
        const mappedIdentity = identityMapping[userData.data.identity] || 'NO_PERMISSION';
        setUser({ ...userData.data, identity: mappedIdentity });
        
        // 成功后，设置用户为已认证状态
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        
        switch (mappedIdentity) {
          case 'NO_PERMISSION':
            navigate('/profile-setup');
            break;
          case 'USER':
          case 'DEVELOPER':
          case 'ADMIN':
            navigate('/home');
            break;
          default:
            setError('Unrecognized user identity');
            break;
        }
      } else {
        setError('No auth token received from backend');
      }      
    } catch (error) {
      console.error('Error during login request:', error);
      setError('失敗，請稍後再次嘗試');
    }
  };

  const onFailure = () => {
    alert("登入失敗，請稍後再嘗試");
  };

  return (
    <div className={styles.container}>
      <div className={styles.stars}></div>
      <div className={styles.stars2}></div>
      <div className={styles.stars3}></div>

      <GoogleOAuthProvider clientId={clientId}>
        <LoginForm error={error} onSuccess={onSuccess} onFailure={onFailure} />
      </GoogleOAuthProvider>
    </div>

  );
};

export default Login;
