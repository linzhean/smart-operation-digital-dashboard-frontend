import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const clientId = "1075175391475-lk5iaeofjp7gggpc0c5fiovusvbunp5t.apps.googleusercontent.com";

function Login() {
  const navigate = useNavigate();
  
  const onSuccess = (response: any) => {
    console.log("LOGIN SUCCESS! Current user:", response.profileObj);
    navigate("/home");
  };

  const onFailure = (error: any) => {
    console.log("LOGIN FAILED! Error:", error);
  };

  return (
    <div className='wrapper'>
      <h2>欢迎回来！</h2>
      <div id='signInButton'>
        <GoogleLogin 
          clientId={clientId}
          buttonText={"使用 Google 登录"}
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
      </div>
    </div>
  );
}

export default Login;
