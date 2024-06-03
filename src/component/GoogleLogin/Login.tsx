import React, { useEffect, useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode }from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Login.module.css'; // 使用 CSS Modules

const backendApiUrl = "http://140.131.115.153:8080";
const clientId = "629445899576-8mdmcg0etm5r7i28dk088fas2o3tjpm0.apps.googleusercontent.com";

interface DecodedToken {
  sub: string;
  [key: string]: any;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [clientToken, setClientToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [logoutMessage, setLogoutMessage] = useState<string>("");

  useEffect(() => {
    const fetchClientToken = async () => {
      try {
        const response = await fetch(`${backendApiUrl}/get-client-token`);
        if (!response.ok) {
          throw new Error('Failed to fetch client token');
        }
        const data = await response.json();
        console.log("Fetched client token:", data.clientToken);
        setClientToken(data.clientToken);
      } catch (error) {
        console.error('Error fetching client token:', error);
        setError('Failed to fetch client token');
      }
    };
    fetchClientToken();
  }, []);

  useEffect(() => {
    if (location.state && location.state.message) {
      setLogoutMessage(location.state.message);
    }
  }, [location.state]);

  const onSuccess = async (credentialResponse: any) => {
    try {
      console.log("LOGIN SUCCESS! Current user:", credentialResponse);

      const idToken = credentialResponse.credential;
      const decodedToken: DecodedToken = jwtDecode(idToken);
      console.log("Decoded Token:", decodedToken);
      console.log("Google ID Token:", idToken);

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
        navigate('/pdata'); // 登录成功后导航到Pdata页面
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
    alert("登入失敗，請稍後再試。");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className={styles.wrapper}>
        <h2>歡迎回來！</h2>
        {error && <p>{error}</p>}
        {logoutMessage && <p>{logoutMessage}</p>}
        <div id='signInButton' className={styles.loginbtn}>
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onFailure}
          />
        </div>
        <div className={styles.star}>
          <div className={styles.box}>
            <div className={styles["out-div"]}></div>
            <div className={styles["out-div"]}></div>
            <div className={`${styles["out-div"]} ${styles["out-front"]}`}></div>
            <div className={`${styles["out-div"]} ${styles["out-back"]}`}></div>
            <div className={`${styles["out-div"]} ${styles["out-left"]}`}></div>
            <div className={`${styles["out-div"]} ${styles["out-right"]}`}></div>
            <div className={`${styles["out-div"]} ${styles["out-top"]}`}></div>
            <div className={`${styles["out-div"]} ${styles["out-bottom"]}`}></div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
