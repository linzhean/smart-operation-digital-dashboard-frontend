import React, { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import styles from "../../styles/Login.module.css";
import "../../styles/global.css"

const backendApiUrl = "http://140.131.115.153:8080";
const clientId = "629445899576-8mdmcg0etm5r7i28dk088fas2o3tjpm0.apps.googleusercontent.com";

interface DecodedToken {
  sub: string;
  [key: string]: any;
}

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

      const decodedToken: DecodedToken = jwtDecode(idToken) as DecodedToken;
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
      <div className={styles.wrapper}>
        <h2>欢迎回来！</h2>
        {error && <p>{error}</p>}
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