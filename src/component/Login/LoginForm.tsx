import React from 'react';
import styles from './Login.module.css';
import GoogleLoginButton from './GoogleLoginButton';

interface LoginFormProps {
  error: string;
  onSuccess: (credentialResponse: any) => void;
  onFailure: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ error, onSuccess, onFailure }) => {
  return (
    <div className={styles['loginbody']}>

      <div className={styles.box}>
        <div className={`${styles['out-div']} ${styles['out-front']}`}></div>
        <div className={`${styles['out-div']} ${styles['out-back']}`}></div>
        <div className={`${styles['out-div']} ${styles['out-left']}`}></div>
        <div className={`${styles['out-div']} ${styles['out-right']}`}></div>
        <div className={`${styles['out-div']} ${styles['out-top']}`}></div>
        <div className={`${styles['out-div']} ${styles['out-bottom']}`}></div>
      </div>

      <div className={styles['login-wrapper']}>
        {error && <p className={styles.errorMsg}>{error}</p>}
        <h2>歡迎回來！</h2>
        <div id='signInButton' className={styles['login-wrapper__loginbtn']}>
          <GoogleLoginButton onSuccess={onSuccess} onFailure={onFailure} />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
