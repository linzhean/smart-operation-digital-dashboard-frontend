import React from 'react';
import styles from '../../styles/Login.module.css';
import '../../styles/content.css'
import GoogleLoginButton from './GoogleLoginButton';

interface LoginFormProps {
  error: string;
  onSuccess: (credentialResponse: any) => void;
  onFailure: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ error, onSuccess, onFailure }) => {
  return (
    <div className={styles['login-wrapper']}>
      
      <div className={styles.star}>
        <div className={styles.box}>
          <div className={styles['out-div']}></div>
          <div className={styles['out-div']}></div>
          <div className={`${styles['out-div']} ${styles['out-front']}`}></div>
          <div className={`${styles['out-div']} ${styles['out-back']}`}></div>
          <div className={`${styles['out-div']} ${styles['out-left']}`}></div>
          <div className={`${styles['out-div']} ${styles['out-right']}`}></div>
          <div className={`${styles['out-div']} ${styles['out-top']}`}></div>
          <div className={`${styles['out-div']} ${styles['out-bottom']}`}></div>
        </div>
      </div>
      
      <h2>歡迎回來！</h2>
      {error && <p>{error}</p>}
      <div id='signInButton' className={styles['login-wrapper__loginbtn']}>
        <GoogleLoginButton onSuccess={onSuccess} onFailure={onFailure} />
      </div>
    </div>
  );
};

export default LoginForm;
